import { apiResponse, getModerator } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { broadcastToGame } from "@/lib/supabase/admin";

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

  const round = await prisma.gameRound.findFirst({
    where: { gameSessionId: id, roundNumber: session.currentRound, startedAt: null },
  });
  if (!round) return apiResponse(null, "El tiempo ya fue iniciado en esta ronda", 400);

  await prisma.gameRound.update({
    where: { id: round.id },
    data: { startedAt: new Date() },
  });

  await broadcastToGame(session.roomCode, "timer:start", {
    type: "timer:start",
    roundId: round.id,
    timePerQuestion: session.timePerQuestion,
  });

  return apiResponse({ ok: true }, null);
}
