import { prisma } from "@/lib/prisma";
import type { GameStats } from "./realtime";

export async function calculateGameStats(
  sessionId: string,
  totalRounds: number
): Promise<GameStats> {
  const answers = await prisma.playerAnswer.findMany({
    where: { gameRound: { gameSessionId: sessionId } },
    include: { gamePlayer: { select: { nickname: true } } },
  });

  type PlayerStat = {
    nickname: string;
    correctCount: number;
    correctResponseMs: number[];
  };

  const map = new Map<string, PlayerStat>();

  for (const a of answers) {
    const entry = map.get(a.gamePlayerId) ?? {
      nickname: a.gamePlayer.nickname,
      correctCount: 0,
      correctResponseMs: [],
    };
    if (a.isCorrect) {
      entry.correctCount++;
      if (a.responseMs !== null) entry.correctResponseMs.push(a.responseMs);
    }
    map.set(a.gamePlayerId, entry);
  }

  const stats = Array.from(map.values());

  const fastestEntry = stats
    .filter((s) => s.correctResponseMs.length > 0)
    .sort((a, b) => {
      const avgA = a.correctResponseMs.reduce((x, y) => x + y, 0) / a.correctResponseMs.length;
      const avgB = b.correctResponseMs.reduce((x, y) => x + y, 0) / b.correctResponseMs.length;
      return avgA - avgB;
    })[0];

  const mostCorrectEntry = stats.sort((a, b) => b.correctCount - a.correctCount)[0];

  const perfectScorers = stats
    .filter((s) => s.correctCount === totalRounds)
    .map((s) => s.nickname);

  return {
    fastestPlayer: fastestEntry?.nickname ?? null,
    mostCorrect: mostCorrectEntry
      ? { nickname: mostCorrectEntry.nickname, count: mostCorrectEntry.correctCount, total: totalRounds }
      : null,
    perfectScorers,
  };
}
