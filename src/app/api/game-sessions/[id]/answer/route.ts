import { apiResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { broadcastToGame } from "@/lib/supabase/admin";
import { calculateScore } from "@/lib/game/scoring";
import { getShuffledOptions } from "@/lib/game/shuffle";

const VALID_OPTIONS = ["A", "B", "C", "D"] as const;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const playerId = request.headers.get("x-player-id");
  if (!playerId) return apiResponse(null, "x-player-id header requerido", 401);

  const { id: sessionId } = await params;

  const player = await prisma.gamePlayer.findFirst({
    where: { id: playerId, gameSessionId: sessionId },
  });
  if (!player) return apiResponse(null, "Jugador no encontrado en esta sesión", 403);

  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
  });
  if (!session || session.status !== "active") {
    return apiResponse(null, "Partida no activa", 400);
  }

  const body = (await request.json()) as { gameRoundId?: unknown; selectedOption?: unknown };

  if (typeof body.gameRoundId !== "string") {
    return apiResponse(null, "gameRoundId requerido", 400);
  }
  if (!VALID_OPTIONS.includes(body.selectedOption as (typeof VALID_OPTIONS)[number])) {
    return apiResponse(null, "Opción inválida", 400);
  }

  const round = await prisma.gameRound.findFirst({
    where: { id: body.gameRoundId, gameSessionId: sessionId, finishedAt: null },
    include: { question: true },
  });
  if (!round || !round.startedAt) return apiResponse(null, "Ronda no activa", 400);

  const alreadyAnswered = await prisma.playerAnswer.findUnique({
    where: { gameRoundId_gamePlayerId: { gameRoundId: round.id, gamePlayerId: playerId } },
  });
  if (alreadyAnswered) return apiResponse(null, "Ya respondiste esta ronda", 400);

  const selectedOption = body.selectedOption as string;
  // Aplicar el mismo shuffle determinista que se usó al transmitir la pregunta
  const shuffled = getShuffledOptions(round.question, round.id);
  const isCorrect = selectedOption === shuffled.shuffledCorrectOption;
  const responseMs = Date.now() - round.startedAt.getTime();
  const score = calculateScore(isCorrect, responseMs, session.timePerQuestion * 1000);

  await prisma.playerAnswer.create({
    data: {
      gameRoundId: round.id,
      gamePlayerId: playerId,
      selectedOption,
      isCorrect,
      score,
      answeredAt: new Date(),
      responseMs,
    },
  });

  const answeredCount = await prisma.playerAnswer.count({
    where: { gameRoundId: round.id },
  });
  const totalPlayers = await prisma.gamePlayer.count({
    where: { gameSessionId: sessionId, isConnected: true },
  });

  await broadcastToGame(session.roomCode, "answer:count", {
    type: "answer:count",
    answered: answeredCount,
    total: totalPlayers,
  });

  return apiResponse({ isCorrect, score }, null);
}
