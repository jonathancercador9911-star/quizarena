"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Square } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getChannelName, type GameEvent, type LeaderboardEntry, type GameStats } from "@/lib/game/realtime";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Leaderboard } from "@/components/game/Leaderboard";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface InitialRound {
  id: string;
  roundNumber: number;
  question: { text: string };
}

interface Props {
  sessionId: string;
  roomCode: string;
  totalRounds: number;
  initialRound: InitialRound;
  totalPlayers: number;
}

export function GameControlPanel({
  sessionId,
  roomCode,
  totalRounds,
  initialRound,
  totalPlayers,
}: Props) {
  const router = useRouter();
  const [roundNumber, setRoundNumber] = useState(initialRound.roundNumber);
  const [questionText, setQuestionText] = useState(initialRound.question.text);
  const [answered, setAnswered] = useState(0);
  const [total, setTotal] = useState(totalPlayers);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const [ending, setEnding] = useState(false);
  const [phase, setPhase] = useState<"active" | "leaderboard" | "finished">("active");

  const handleEvent = useCallback((event: GameEvent) => {
    if (event.type === "answer:count") {
      setAnswered(event.answered);
      setTotal(event.total);
    } else if (event.type === "question:show") {
      setRoundNumber(event.roundNumber);
      setQuestionText(event.question.text);
      setAnswered(0);
      setPhase("active");
      setAdvancing(false);
    } else if (event.type === "leaderboard:show") {
      setLeaderboard(event.leaderboard);
      setPhase("leaderboard");
    } else if (event.type === "game:ended") {
      setLeaderboard(event.finalLeaderboard);
      if (event.stats) setGameStats(event.stats);
      setPhase("finished");
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel;
    channel = supabase.channel(getChannelName(roomCode));
    channel
      .on<GameEvent>("broadcast", { event: "answer:count" }, ({ payload }) => handleEvent(payload))
      .on<GameEvent>("broadcast", { event: "question:show" }, ({ payload }) => handleEvent(payload))
      .on<GameEvent>("broadcast", { event: "leaderboard:show" }, ({ payload }) => handleEvent(payload))
      .on<GameEvent>("broadcast", { event: "game:ended" }, ({ payload }) => handleEvent(payload))
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [roomCode, handleEvent]);

  async function handleNext() {
    setAdvancing(true);
    const res = await fetch(`/api/game-sessions/${sessionId}/next`, { method: "POST" });
    const json = (await res.json()) as { data: { finished?: boolean } | null };
    if (json.data?.finished) {
      router.push("/games");
    }
  }

  async function handleEnd() {
    if (!confirm("¿Terminar la partida ahora?")) return;
    setEnding(true);
    await fetch(`/api/game-sessions/${sessionId}/end`, { method: "POST" });
    router.push("/games");
  }

  if (phase === "finished") {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#F8FAFC]">Partida finalizada</h2>
          <div className="flex gap-2">
            <a href={`/api/game-sessions/${sessionId}/export`} download>
              <Button variant="outline" size="sm"
                className="border-[#2D2A3E] text-[#F8FAFC] hover:bg-[#2D2A3E]">
                <Download className="h-4 w-4 mr-1.5" />
                Exportar CSV
              </Button>
            </a>
            <Button onClick={() => router.push("/games/new")}
              size="sm" className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white">
              Nueva partida
            </Button>
          </div>
        </div>

        {gameStats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {gameStats.fastestPlayer && (
              <div className="rounded-xl border border-[#2D2A3E] bg-[#1E1B2E] p-4 text-center">
                <p className="text-xl mb-1">⚡</p>
                <p className="text-xs text-[#9CA3AF] uppercase tracking-wide">Más rápido</p>
                <p className="font-semibold text-[#F8FAFC] mt-1 truncate">{gameStats.fastestPlayer}</p>
              </div>
            )}
            {gameStats.mostCorrect && (
              <div className="rounded-xl border border-[#2D2A3E] bg-[#1E1B2E] p-4 text-center">
                <p className="text-xl mb-1">🎯</p>
                <p className="text-xs text-[#9CA3AF] uppercase tracking-wide">Más correctas</p>
                <p className="font-semibold text-[#F8FAFC] mt-1 truncate">{gameStats.mostCorrect.nickname}</p>
                <p className="text-xs text-[#9CA3AF]">
                  {gameStats.mostCorrect.count}/{gameStats.mostCorrect.total}
                </p>
              </div>
            )}
            {gameStats.perfectScorers.length > 0 && (
              <div className="rounded-xl border border-[#2D2A3E] bg-[#1E1B2E] p-4 text-center">
                <p className="text-xl mb-1">🏆</p>
                <p className="text-xs text-[#9CA3AF] uppercase tracking-wide">Puntaje perfecto</p>
                <p className="font-semibold text-[#F8FAFC] mt-1 truncate">
                  {gameStats.perfectScorers.slice(0, 2).join(", ")}
                  {gameStats.perfectScorers.length > 2 && ` +${gameStats.perfectScorers.length - 2}`}
                </p>
              </div>
            )}
          </div>
        )}

        <Leaderboard entries={leaderboard} />
        <Button variant="ghost" onClick={() => router.push("/games")}
          className="text-[#9CA3AF] hover:text-[#F8FAFC]">
          Volver al historial
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main control */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-xl border border-[#2D2A3E] bg-[#1E1B2E] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#9CA3AF] uppercase tracking-wider">
              Pregunta {roundNumber} / {totalRounds}
            </span>
            {phase === "leaderboard" && (
              <span className="text-xs text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-1 rounded-full">
                Mostrando leaderboard...
              </span>
            )}
          </div>
          <p className="text-lg font-semibold text-[#F8FAFC] leading-snug">{questionText}</p>

          {/* Answer progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#9CA3AF]">Respuestas</span>
              <span className="text-[#F8FAFC] font-bold">{answered} / {total}</span>
            </div>
            <div className="h-3 rounded-full bg-[#13111A] overflow-hidden">
              <div
                className="h-full bg-[#7C3AED] rounded-full transition-all duration-300"
                style={{ width: total > 0 ? `${(answered / total) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleNext}
            disabled={advancing || ending}
            className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white h-12 font-semibold"
          >
            <ChevronRight className="h-5 w-5 mr-1" />
            {advancing ? "Avanzando..." : roundNumber >= totalRounds ? "Ver resultados" : "Siguiente pregunta"}
          </Button>
          <Button
            onClick={handleEnd}
            disabled={advancing || ending}
            variant="outline"
            className="border-[#EF4444]/50 text-[#EF4444] hover:bg-[#EF4444]/10"
          >
            <Square className="h-4 w-4 mr-1" />
            {ending ? "Terminando..." : "Terminar"}
          </Button>
        </div>
      </div>

      {/* Live leaderboard sidebar */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[#9CA3AF] uppercase tracking-wider">
          Clasificación en vivo
        </h3>
        {leaderboard.length === 0 ? (
          <p className="text-sm text-[#9CA3AF]">Disponible tras la primera ronda.</p>
        ) : (
          <Leaderboard entries={leaderboard} compact />
        )}
      </div>
    </div>
  );
}
