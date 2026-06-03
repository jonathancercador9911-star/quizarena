import { apiResponse, getModerator } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { generateRoomCode } from "@/lib/game/room-code";

const VALID_MODES = ["individual", "teams"] as const;
const VALID_TIMES = [10, 20, 30] as const;

export async function POST(request: Request) {
  const moderator = await getModerator();
  if (!moderator) return apiResponse(null, "No autorizado", 401);

  const body = (await request.json()) as Record<string, unknown>;
  const { questionBankId, mode, teams, timePerQuestion } = body;

  if (typeof questionBankId !== "string") {
    return apiResponse(null, "Banco de preguntas requerido", 400);
  }
  if (!VALID_MODES.includes(mode as (typeof VALID_MODES)[number])) {
    return apiResponse(null, "Modo inválido", 400);
  }
  if (!VALID_TIMES.includes(timePerQuestion as (typeof VALID_TIMES)[number])) {
    return apiResponse(null, "Tiempo por pregunta inválido", 400);
  }

  const bank = await prisma.questionBank.findFirst({
    where: {
      id: questionBankId,
      OR: [{ moderatorId: moderator.id }, { isSystem: true }],
    },
    include: { _count: { select: { bankQuestions: true } } },
  });

  if (!bank) return apiResponse(null, "Banco no encontrado", 404);

  const totalRounds = bank._count.bankQuestions;
  if (totalRounds === 0) {
    return apiResponse(null, "El banco no tiene preguntas", 400);
  }

  if (mode === "teams") {
    const teamsData = teams as { name?: unknown; color?: unknown }[] | undefined;
    if (!Array.isArray(teamsData) || teamsData.length < 2) {
      return apiResponse(null, "Se requieren al menos 2 equipos", 400);
    }
    if (teamsData.length > 8) {
      return apiResponse(null, "Máximo 8 equipos", 400);
    }
    for (const t of teamsData) {
      if (typeof t.name !== "string" || t.name.trim() === "") {
        return apiResponse(null, "Todos los equipos deben tener nombre", 400);
      }
    }
  }

  // Generar código único
  let roomCode: string = "";
  for (let i = 0; i < 10; i++) {
    const candidate = generateRoomCode();
    const exists = await prisma.gameSession.findUnique({
      where: { roomCode: candidate },
    });
    if (!exists) { roomCode = candidate; break; }
  }
  if (!roomCode) return apiResponse(null, "No se pudo generar código de sala", 500);

  const session = await prisma.gameSession.create({
    data: {
      roomCode,
      moderatorId: moderator.id,
      questionBankId,
      mode: mode as string,
      status: "lobby",
      totalRounds,
      timePerQuestion: timePerQuestion as number,
    },
  });

  if (mode === "teams" && Array.isArray(teams)) {
    const teamsData = teams as { name: string; color: string }[];
    await prisma.team.createMany({
      data: teamsData.map((t) => ({
        gameSessionId: session.id,
        name: t.name.trim(),
        color: t.color,
      })),
    });
  }

  return apiResponse({ id: session.id, roomCode: session.roomCode }, null, 201);
}
