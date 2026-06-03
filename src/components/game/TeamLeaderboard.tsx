import { cn } from "@/lib/utils";
import type { TeamEntry } from "@/lib/game/realtime";

interface TeamLeaderboardProps {
  entries: TeamEntry[];
  myTeamId?: string | null;
}

export function TeamLeaderboard({ entries, myTeamId }: TeamLeaderboardProps) {
  return (
    <div className="w-full space-y-2">
      {entries.map((team, i) => {
        const isMyTeam = team.teamId === myTeamId;
        return (
          <div
            key={team.teamId}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 border transition-colors",
              isMyTeam
                ? "border-[#7C3AED]/40 bg-[#7C3AED]/10"
                : "border-[#2D2A3E] bg-[#1E1B2E]"
            )}
          >
            <span className="text-sm font-bold text-[#9CA3AF] w-5 text-center shrink-0">
              {i + 1}.
            </span>
            <span
              className="h-4 w-4 rounded-full shrink-0"
              style={{ backgroundColor: team.color }}
            />
            <span className={cn("flex-1 font-medium", isMyTeam ? "text-[#F8FAFC]" : "text-[#9CA3AF]")}>
              {team.name}
              {isMyTeam && <span className="text-[#7C3AED] ml-1 text-xs">(tu equipo)</span>}
            </span>
            <span className="text-sm font-bold text-[#F8FAFC] shrink-0">
              {team.totalScore.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
