"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getChannelName, type PresencePlayer } from "@/lib/game/realtime";
import { Button } from "@/components/ui/button";
import { RoomCodeDisplay } from "@/components/shared/RoomCodeDisplay";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface Team {
  id: string;
  name: string;
  color: string;
}

interface Props {
  sessionId: string;
  roomCode: string;
  mode: string;
  teams: Team[];
  totalRounds: number;
}

export function ModeratorLobby({
  sessionId,
  roomCode,
  mode,
  teams,
  totalRounds,
}: Props) {
  const router = useRouter();
  const [players, setPlayers] = useState<PresencePlayer[]>([]);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel;

    channel = supabase.channel(getChannelName(roomCode));
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<PresencePlayer>();
        setPlayers(Object.values(state).flat());
      })
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [roomCode]);

  async function handleStart() {
    setStarting(true);
    setError(null);

    const res = await fetch(`/api/game-sessions/${sessionId}/start`, {
      method: "POST",
    });
    const json = (await res.json()) as { error: string | null };

    if (json.error) {
      setError(json.error);
      setStarting(false);
      return;
    }

    router.push(`/games/${sessionId}/control`);
  }

  return (
    <div className="space-y-8">
      <RoomCodeDisplay code={roomCode} size="lg" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Player list */}
        <div className="rounded-xl border border-[#2D2A3E] bg-[#1E1B2E] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-[#9CA3AF]" />
            <h3 className="text-sm font-medium text-[#9CA3AF] uppercase tracking-wider">
              Jugadores conectados
            </h3>
            <span className="ml-auto text-sm font-bold text-[#F8FAFC]">
              {players.length}
            </span>
          </div>

          {players.length === 0 ? (
            <p className="text-sm text-[#9CA3AF] text-center py-4">
              Esperando jugadores...
            </p>
          ) : (
            <ul className="space-y-2">
              {players.map((p) => (
                <li
                  key={p.playerId}
                  className="flex items-center gap-2 text-sm text-[#F8FAFC]"
                >
                  <span className="h-2 w-2 rounded-full bg-[#10B981] shrink-0" />
                  {p.nickname}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Game info */}
        <div className="rounded-xl border border-[#2D2A3E] bg-[#1E1B2E] p-5 space-y-4">
          <h3 className="text-sm font-medium text-[#9CA3AF] uppercase tracking-wider">
            Configuración
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Modo</span>
              <span className="text-[#F8FAFC] font-medium capitalize">
                {mode === "individual" ? "Individual" : "Equipos"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Preguntas</span>
              <span className="text-[#F8FAFC] font-medium">{totalRounds}</span>
            </div>
          </div>

          {mode === "teams" && teams.length > 0 && (
            <div className="pt-2 border-t border-[#2D2A3E] space-y-2">
              <p className="text-xs text-[#9CA3AF] uppercase tracking-wider">Equipos</p>
              {teams.map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="text-[#F8FAFC]">{t.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-[#EF4444]/10 border border-[#EF4444]/20 p-3 text-sm text-[#EF4444]">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handleStart}
          disabled={players.length === 0 || starting}
          className="bg-[#10B981] hover:bg-[#059669] text-white h-14 px-12 text-lg font-bold disabled:opacity-50"
        >
          <Play className="h-5 w-5 mr-2" />
          {starting ? "Iniciando..." : "Iniciar partida"}
        </Button>
      </div>

      {players.length === 0 && (
        <p className="text-center text-xs text-[#9CA3AF]">
          Necesitas al menos 1 jugador para iniciar.
        </p>
      )}
    </div>
  );
}
