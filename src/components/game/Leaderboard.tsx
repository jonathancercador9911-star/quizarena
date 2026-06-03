import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/game/realtime";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  myPlayerId?: string;
  compact?: boolean;
}

const RANK_COLORS = ["text-[#F59E0B]", "text-[#9CA3AF]", "text-[#F97316]"];
const RANK_MEDALS = ["🥇", "🥈", "🥉"];

export function Leaderboard({ entries, myPlayerId, compact = false }: LeaderboardProps) {
  const shown = compact ? entries.slice(0, 5) : entries;

  return (
    <div className="w-full space-y-2 animate-in slide-in-from-bottom-4 duration-300">
      {shown.map((entry, i) => {
        const isMe = entry.playerId === myPlayerId;
        return (
          <div
            key={entry.playerId}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
              isMe
                ? "bg-[#7C3AED]/20 border border-[#7C3AED]/40"
                : "bg-[#1E1B2E] border border-[#2D2A3E]"
            )}
          >
            <span
              className={cn(
                "w-7 text-center text-sm font-bold shrink-0",
                RANK_COLORS[i] ?? "text-[#9CA3AF]"
              )}
            >
              {i < 3 ? RANK_MEDALS[i] : `${i + 1}.`}
            </span>
            <span
              className={cn(
                "flex-1 font-medium truncate",
                isMe ? "text-[#F8FAFC]" : "text-[#9CA3AF]"
              )}
            >
              {entry.nickname}
              {isMe && <span className="text-[#7C3AED] ml-1 text-xs">(tú)</span>}
            </span>
            <div className="text-right shrink-0 space-y-0.5">
              <p className="text-sm font-bold text-[#F8FAFC]">
                {entry.totalScore.toLocaleString()} Gloria
              </p>
              {entry.correctCount !== undefined && (
                <p className="text-xs text-[#9CA3AF]">
                  ✅ {entry.correctCount} correctas
                </p>
              )}
              {entry.totalTimeMs !== undefined && entry.totalTimeMs > 0 && (
                <p className="text-xs text-[#9CA3AF]">
                  ⏱ {(entry.totalTimeMs / 1000).toFixed(1)}s total
                </p>
              )}
              {entry.scoreDelta !== undefined && entry.scoreDelta > 0 && (
                <p className="text-xs text-[#10B981]">+{entry.scoreDelta}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
