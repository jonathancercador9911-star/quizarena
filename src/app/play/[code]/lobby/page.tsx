"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getChannelName, type GameEvent, type PresencePlayer } from "@/lib/game/realtime";
import type { RealtimeChannel } from "@supabase/supabase-js";

export default function PlayerLobbyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [players, setPlayers] = useState<PresencePlayer[]>([]);

  useEffect(() => {
    const storedId = sessionStorage.getItem("quiz_player_id") ?? "";
    const storedNick = sessionStorage.getItem("quiz_player_nickname") ?? "";

    if (!storedId) {
      router.replace("/play");
      return;
    }

    setPlayerId(storedId);
    setNickname(storedNick);

    const supabase = createClient();
    let channel: RealtimeChannel;

    async function subscribe() {
      channel = supabase.channel(getChannelName(code), {
        config: { presence: { key: storedId } },
      });

      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState<PresencePlayer>();
          const connected = Object.values(state).flat();
          setPlayers(connected);
        })
        .on<GameEvent>(
          "broadcast",
          { event: "game:started" },
          () => {
            router.replace(`/play/${code}/game`);
          }
        )
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({ playerId: storedId, nickname: storedNick });
          }
        });
    }

    void subscribe();

    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, [code, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="w-full max-w-sm space-y-8">
        {/* Room code */}
        <div>
          <p className="text-[#9CA3AF] text-sm mb-2">Código de sala</p>
          <p className="font-heading font-extrabold text-5xl tracking-[0.3em] text-[#F8FAFC]">
            {code}
          </p>
        </div>

        {/* Waiting animation */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[#7C3AED] animate-bounce [animation-delay:-0.3s]" />
            <div className="h-2 w-2 rounded-full bg-[#7C3AED] animate-bounce [animation-delay:-0.15s]" />
            <div className="h-2 w-2 rounded-full bg-[#7C3AED] animate-bounce" />
          </div>
          <p className="text-[#9CA3AF] text-sm">
            Esperando que el moderador inicie la partida...
          </p>
        </div>

        {/* Player list */}
        <div className="rounded-xl border border-[#2D2A3E] bg-[#1E1B2E] p-4 text-left space-y-2">
          <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider mb-3">
            Jugadores conectados ({players.length})
          </p>
          {players.length === 0 && (
            <p className="text-sm text-[#9CA3AF] text-center py-2">Conectando...</p>
          )}
          {players.map((p) => (
            <div
              key={p.playerId}
              className="flex items-center gap-2 text-sm"
            >
              <div className="h-2 w-2 rounded-full bg-[#10B981] shrink-0" />
              <span
                className={
                  p.playerId === playerId
                    ? "text-[#F8FAFC] font-semibold"
                    : "text-[#9CA3AF]"
                }
              >
                {p.nickname}
                {p.playerId === playerId && (
                  <span className="text-[#7C3AED] ml-1">(vos)</span>
                )}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-[#9CA3AF]">
          Unido como <span className="text-[#F8FAFC] font-medium">{nickname}</span>
        </p>
      </div>
    </div>
  );
}
