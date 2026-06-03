export const getChannelName = (roomCode: string) => `game:${roomCode}`;

export type PlayerTeamInfo = {
  teamId: string;
  teamName: string;
  teamColor: string;
};
export type PlayerTeamMap = Record<string, PlayerTeamInfo>;

export type QuestionPayload = {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
};

export type LeaderboardEntry = {
  playerId: string;
  nickname: string;
  totalScore: number;
  rank: number;
  scoreDelta?: number;
};

export type TeamEntry = {
  teamId: string;
  name: string;
  color: string;
  totalScore: number;
};

export type GameEvent =
  | {
      type: "game:started";
      roundId: string;
      roundNumber: number;
      totalRounds: number;
      question: QuestionPayload;
      timePerQuestion: number;
      playerTeams?: PlayerTeamMap;
    }
  | {
      type: "question:show";
      roundId: string;
      roundNumber: number;
      totalRounds: number;
      question: QuestionPayload;
      timePerQuestion: number;
    }
  | { type: "answer:count"; answered: number; total: number }
  | {
      type: "leaderboard:show";
      leaderboard: LeaderboardEntry[];
      teamLeaderboard?: TeamEntry[];
    }
  | { type: "game:ended"; finalLeaderboard: LeaderboardEntry[]; stats?: GameStats };

export type PresencePlayer = {
  playerId: string;
  nickname: string;
};

export type GameStats = {
  fastestPlayer: string | null;
  mostCorrect: { nickname: string; count: number; total: number } | null;
  perfectScorers: string[];
};
