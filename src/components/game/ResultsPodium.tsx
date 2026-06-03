"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/game/realtime";

interface ResultsPodiumProps {
  leaderboard: LeaderboardEntry[];
  myPlayerId?: string;
}

const MEDALS = ["🥇", "🥈", "🥉"];
const PODIUM_HEIGHTS = ["h-24", "h-16", "h-12"];
const PODIUM_ORDER = [1, 0, 2]; // 2nd left, 1st center, 3rd right

export function ResultsPodium({ leaderboard, myPlayerId }: ResultsPodiumProps) {
  const top3 = leaderboard.slice(0, 3);

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#7C3AED", "#10B981", "#F59E0B"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#7C3AED", "#EF4444", "#3B82F6"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* Podium */}
      {top3.length >= 2 && (
        <div className="flex items-end justify-center gap-3">
          {PODIUM_ORDER.map((rank) => {
            const entry = top3[rank];
            if (!entry) return <div key={rank} className="w-28" />;
            const isMe = entry.playerId === myPlayerId;
            return (
              <div key={entry.playerId} className="flex flex-col items-center gap-2 w-28">
                <span className="text-2xl">{MEDALS[rank]}</span>
                <p
                  className={cn(
                    "text-xs font-semibold text-center truncate w-full px-1",
                    isMe ? "text-[#7C3AED]" : "text-[#F8FAFC]"
                  )}
                >
                  {entry.nickname}
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  {entry.totalScore.toLocaleString()} pts
                </p>
                <div
                  className={cn(
                    "w-full rounded-t-lg flex items-end justify-center pb-2",
                    PODIUM_HEIGHTS[rank],
                    rank === 0
                      ? "bg-[#F59E0B]/20 border-t-2 border-[#F59E0B]"
                      : rank === 1
                      ? "bg-[#9CA3AF]/20 border-t-2 border-[#9CA3AF]"
                      : "bg-[#F97316]/20 border-t-2 border-[#F97316]"
                  )}
                >
                  <span className="font-heading font-extrabold text-xl text-[#F8FAFC]">
                    {rank + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full leaderboard */}
      <div className="space-y-2">
        {leaderboard.map((entry, i) => {
          const isMe = entry.playerId === myPlayerId;
          return (
            <div
              key={entry.playerId}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 border text-sm",
                isMe
                  ? "bg-[#7C3AED]/20 border-[#7C3AED]/40"
                  : "bg-[#1E1B2E] border-[#2D2A3E]"
              )}
            >
              <span className="w-6 text-center font-bold text-[#9CA3AF] shrink-0">
                {i < 3 ? MEDALS[i] : `${i + 1}.`}
              </span>
              <span className={cn("flex-1 font-medium truncate", isMe ? "text-[#F8FAFC]" : "text-[#9CA3AF]")}>
                {entry.nickname}
                {isMe && <span className="text-[#7C3AED] ml-1 text-xs">(vos)</span>}
              </span>
              <span className="font-bold text-[#F8FAFC] shrink-0">
                {entry.totalScore.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
