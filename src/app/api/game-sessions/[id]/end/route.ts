import { apiResponse, getModerator } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { broadcastToGame } from "@/lib/supabase/admin";
import { calculateGameStats } from "@/lib/game/stats";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const moderator = await getModerator();
  if (!moderator) return apiResponse(null, "No autorizado", 401);

  const { id } = await params;

  const session = await prisma.gameSession.findFirst({
    where: { id, moderatorId: moderator.id, status: "active" },
  });
  if (!session) return apiResponse(null, "Sesión no encontrada o no activa", 404);

  await prisma.gameSession.update({
    where: { id },
    data: { status: "finished", finishedAt: new Date() },
  });

  const players = await prisma.gamePlayer.findMany({
    where: { gameSessionId: id },
    orderBy: { totalScore: "desc" },
  });
  const leaderboard = players.map((p, i) => ({
    playerId: p.id,
    nickname: p.nickname,
    totalScore: p.totalScore,
    rank: i + 1,
  }));

  const stats = await calculateGameStats(id, session.totalRounds);

  await broadcastToGame(session.roomCode, "game:ended", {
    type: "game:ended",
    finalLeaderboard: leaderboard,
    stats,
  });

  return apiResponse({ finished: true }, null);
}
