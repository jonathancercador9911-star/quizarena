import { apiResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const roomCode = code.toUpperCase();

  const session = await prisma.gameSession.findUnique({
    where: { roomCode },
    include: { _count: { select: { players: true } } },
  });

  if (!session) return apiResponse(null, "Sala no encontrada", 404);
  if (session.status !== "lobby") {
    return apiResponse(null, "La partida ya comenzó", 400);
  }

  return apiResponse(
    {
      roomCode: session.roomCode,
      status: session.status,
      mode: session.mode,
      playerCount: session._count.players,
    },
    null
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const roomCode = code.toUpperCase();

  const session = await prisma.gameSession.findUnique({
    where: { roomCode },
    include: { teams: true },
  });

  if (!session) return apiResponse(null, "Sala no encontrada", 404);
  if (session.status !== "lobby") {
    return apiResponse(null, "La partida ya comenzó", 400);
  }

  const body = (await request.json()) as { nickname?: unknown };
  const nickname =
    typeof body.nickname === "string" ? body.nickname.trim() : "";

  if (nickname.length < 2 || nickname.length > 20) {
    return apiResponse(null, "El nombre debe tener entre 2 y 20 caracteres", 400);
  }

  const existing = await prisma.gamePlayer.findFirst({
    where: { gameSessionId: session.id, nickname },
  });
  if (existing) {
    return apiResponse(null, "Ese nombre ya está en uso en esta sala", 400);
  }

  const player = await prisma.gamePlayer.create({
    data: { gameSessionId: session.id, nickname },
  });

  return apiResponse(
    {
      playerId: player.id,
      gameSessionId: session.id,
      roomCode: session.roomCode,
      mode: session.mode,
      teams: session.teams,
    },
    null,
    201
  );
}
