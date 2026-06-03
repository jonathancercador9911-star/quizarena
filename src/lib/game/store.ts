import { create } from "zustand";
import type { QuestionPayload, LeaderboardEntry, TeamEntry, PlayerTeamMap, GameStats } from "./realtime";

export type GamePhase =
  | "waiting"
  | "question"
  | "answered"
  | "leaderboard"
  | "finished";

interface GameStore {
  phase: GamePhase;
  roundId: string | null;
  roundNumber: number;
  totalRounds: number;
  question: QuestionPayload | null;
  timePerQuestion: number;
  myAnswer: string | null;
  isCorrect: boolean | null;
  roundScore: number;
  leaderboard: LeaderboardEntry[];
  teamLeaderboard: TeamEntry[];
  gameStats: GameStats | null;
  myTeamId: string | null;
  myTeamName: string | null;
  myTeamColor: string | null;

  showQuestion: (
    roundId: string,
    roundNumber: number,
    totalRounds: number,
    question: QuestionPayload,
    timePerQuestion: number,
    playerTeams?: PlayerTeamMap,
    myPlayerId?: string
  ) => void;
  submitAnswer: (answer: string, isCorrect: boolean, score: number) => void;
  timerExpired: () => void;
  showLeaderboard: (entries: LeaderboardEntry[], teamEntries?: TeamEntry[]) => void;
  endGame: (entries: LeaderboardEntry[], stats?: GameStats) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  phase: "waiting",
  roundId: null,
  roundNumber: 0,
  totalRounds: 0,
  question: null,
  timePerQuestion: 20,
  myAnswer: null,
  isCorrect: null,
  roundScore: 0,
  leaderboard: [],
  teamLeaderboard: [],
  gameStats: null,
  myTeamId: null,
  myTeamName: null,
  myTeamColor: null,

  showQuestion: (roundId, roundNumber, totalRounds, question, timePerQuestion, playerTeams, myPlayerId) => {
    const prev = get();
    let myTeamId = prev.myTeamId;
    let myTeamName = prev.myTeamName;
    let myTeamColor = prev.myTeamColor;

    if (playerTeams && myPlayerId && playerTeams[myPlayerId]) {
      const info = playerTeams[myPlayerId];
      myTeamId = info.teamId;
      myTeamName = info.teamName;
      myTeamColor = info.teamColor;
    }

    set({
      phase: "question",
      roundId,
      roundNumber,
      totalRounds,
      question,
      timePerQuestion,
      myAnswer: null,
      isCorrect: null,
      roundScore: 0,
      myTeamId,
      myTeamName,
      myTeamColor,
    });
  },

  submitAnswer: (answer, isCorrect, score) =>
    set({ phase: "answered", myAnswer: answer, isCorrect, roundScore: score }),

  timerExpired: () =>
    set({ phase: "answered", myAnswer: null, isCorrect: false, roundScore: 0 }),

  showLeaderboard: (entries, teamEntries) =>
    set({
      phase: "leaderboard",
      leaderboard: entries,
      teamLeaderboard: teamEntries ?? [],
    }),

  endGame: (entries, stats) =>
    set({ phase: "finished", leaderboard: entries, gameStats: stats ?? null }),
}));
