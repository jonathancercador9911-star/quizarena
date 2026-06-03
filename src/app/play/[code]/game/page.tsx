"use client";

import { use, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getChannelName, type GameEvent } from "@/lib/game/realtime";
import { useGameStore } from "@/lib/game/store";
import { QuestionCard } from "@/components/game/QuestionCard";
import { AnswerButtons } from "@/components/game/AnswerButtons";
import { CountdownTimer } from "@/components/game/CountdownTimer";
import { Leaderboard } from "@/components/game/Leaderboard";
import { TeamLeaderboard } from "@/components/game/TeamLeaderboard";
import { ResultsPodium } from "@/components/game/ResultsPodium";
import type { RealtimeChannel } from "@supabase/supabase-js";

export default function PlayerGamePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
  const store = useGameStore();

  const handleEvent = useCallback(
    (event: GameEvent) => {
      if (event.type === "game:started" || event.type === "question:show") {
        const myPlayerId =
          typeof window !== "undefined"
            ? sessionStorage.getItem("quiz_player_id") ?? ""
            : "";
        store.showQuestion(
          event.roundId,
          event.roundNumber,
          event.totalRounds,
          event.question,
          event.timePerQuestion,
          event.type === "game:started" ? event.playerTeams : undefined,
          myPlayerId
        );
      } else if (event.type === "leaderboard:show") {
        store.showLeaderboard(event.leaderboard, event.teamLeaderboard);
      } else if (event.type === "game:ended") {
        store.endGame(event.finalLeaderboard, event.stats);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const playerId = sessionStorage.getItem("quiz_player_id") ?? "";
    if (!playerId) { router.replace("/play"); return; }

    const supabase = createClient();
    let channel: RealtimeChannel;

    channel = supabase.channel(getChannelName(code));
    channel
      .on<GameEvent>("broadcast", { event: "game:started" }, ({ payload }) => handleEvent(payload))
      .on<GameEvent>("broadcast", { event: "question:show" }, ({ payload }) => handleEvent(payload))
      .on<GameEvent>("broadcast", { event: "leaderboard:show" }, ({ payload }) => handleEvent(payload))
      .on<GameEvent>("broadcast", { event: "game:ended" }, ({ payload }) => handleEvent(payload))
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [code, router, handleEvent]);

  async function handleAnswer(option: "A" | "B" | "C" | "D") {
    if (store.phase !== "question" || !store.roundId) return;

    const playerId = sessionStorage.getItem("quiz_player_id") ?? "";
    const sessionId = sessionStorage.getItem("quiz_session_id") ?? "";

    const res = await fetch(`/api/game-sessions/${sessionId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-player-id": playerId },
      body: JSON.stringify({ gameRoundId: store.roundId, selectedOption: option }),
    });
    const json = (await res.json()) as { data: { isCorrect: boolean; score: number } | null; error: string | null };

    if (json.data) {
      store.submitAnswer(option, json.data.isCorrect, json.data.score);
    } else {
      store.timerExpired();
    }
  }

  const playerId = typeof window !== "undefined" ? sessionStorage.getItem("quiz_player_id") ?? "" : "";
  const sessionMode = typeof window !== "undefined" ? sessionStorage.getItem("quiz_session_mode") ?? "individual" : "individual";
  const isTeamsMode = sessionMode === "teams";

  // --- WAITING ---
  if (store.phase === "waiting") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="flex gap-1.5 mb-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-[#7C3AED] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <p className="text-[#9CA3AF]">Esperando la primera pregunta...</p>
      </div>
    );
  }

  // --- FINISHED ---
  if (store.phase === "finished") {
    const myEntry = store.leaderboard.find((e) => e.playerId === playerId);
    return (
      <div className="flex-1 flex flex-col items-center px-4 py-8 space-y-6 max-w-md mx-auto w-full">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-extrabold text-[#F8FAFC]">
            ¡Juego terminado!
          </h1>
          {myEntry && (
            <p className="text-[#9CA3AF] mt-1">
              Terminaste{" "}
              <span className="text-[#7C3AED] font-bold">#{myEntry.rank}</span>
              {" con "}
              <span className="text-[#F8FAFC] font-bold">
                {myEntry.totalScore.toLocaleString()} pts
              </span>
            </p>
          )}
        </div>
        <ResultsPodium leaderboard={store.leaderboard} myPlayerId={playerId} />
        <button
          onClick={() => router.push("/play")}
          className="text-sm text-[#7C3AED] hover:underline"
        >
          Jugar otra partida
        </button>
      </div>
    );
  }

  // --- LEADERBOARD ---
  if (store.phase === "leaderboard") {
    return (
      <div className="flex-1 flex flex-col items-center px-4 py-8 space-y-4 max-w-md mx-auto w-full">
        <h2 className="font-heading text-xl font-bold text-[#F8FAFC]">
          {isTeamsMode ? "Equipos" : "Clasificación"}
        </h2>
        {isTeamsMode && store.teamLeaderboard.length > 0 ? (
          <>
            <TeamLeaderboard entries={store.teamLeaderboard} myTeamId={store.myTeamId} />
            <details className="w-full">
              <summary className="text-xs text-[#9CA3AF] cursor-pointer hover:text-[#F8FAFC] text-center">
                Ver clasificación individual
              </summary>
              <div className="mt-2">
                <Leaderboard entries={store.leaderboard} myPlayerId={playerId} compact />
              </div>
            </details>
          </>
        ) : (
          <Leaderboard entries={store.leaderboard} myPlayerId={playerId} compact />
        )}
        <p className="text-xs text-[#9CA3AF] animate-pulse">Siguiente pregunta en breve...</p>
      </div>
    );
  }

  // --- ANSWERED ---
  if (store.phase === "answered") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center space-y-4">
        {store.isCorrect ? (
          <>
            <div className="text-5xl">✅</div>
            <p className="text-2xl font-bold text-[#10B981]">¡Correcto!</p>
            <p className="text-[#9CA3AF]">+{store.roundScore} puntos</p>
          </>
        ) : store.myAnswer ? (
          <>
            <div className="text-5xl">❌</div>
            <p className="text-2xl font-bold text-[#EF4444]">Incorrecto</p>
          </>
        ) : (
          <>
            <div className="text-5xl">⏱️</div>
            <p className="text-2xl font-bold text-[#9CA3AF]">Se acabó el tiempo</p>
          </>
        )}
        <p className="text-sm text-[#9CA3AF] animate-pulse mt-4">Esperando al resto...</p>
      </div>
    );
  }

  // --- QUESTION ---
  if (!store.question) return null;
  return (
    <div className="flex-1 flex flex-col items-center px-4 py-6 gap-5 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between w-full">
        <QuestionCard
          text={store.question.text}
          roundNumber={store.roundNumber}
          totalRounds={store.totalRounds}
        />
      </div>
      <div className="relative flex justify-center">
        <CountdownTimer
          key={store.roundId}
          seconds={store.timePerQuestion}
          onExpire={store.timerExpired}
          paused={store.phase !== "question"}
        />
      </div>
      <AnswerButtons
        options={{
          A: store.question.optionA,
          B: store.question.optionB,
          C: store.question.optionC,
          D: store.question.optionD,
        }}
        selected={store.myAnswer}
        disabled={store.phase !== "question"}
        onSelect={handleAnswer}
      />
    </div>
  );
}
