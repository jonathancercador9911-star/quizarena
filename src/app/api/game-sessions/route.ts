import { apiResponse, getModerator } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { generateRoomCode } from "@/lib/game/room-code";

const VALID_MODES = ["individual", "teams"] as const;
const VALID_TIMES = [10, 20, 30] as const;

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export async function POST(request: Request) {
  const moderator = await getModerator();
  if (!moderator) return apiResponse(null, "No autorizado", 401);

  const body = (await request.json()) as Record<string, unknown>;
  const { questionBankIds, mode, teams, timePerQuestion, questionCount } = body;

  // Acepta array o string único (retrocompatibilidad)
  const bankIdsRaw = Array.isArray(questionBankIds)
    ? questionBankIds
    : typeof questionBankIds === "string"
    ? [questionBankIds]
    : [];

  if (bankIdsRaw.length === 0) {
    return apiResponse(null, "Selecciona al menos un banco de preguntas", 400);
  }
  if (!VALID_MODES.includes(mode as (typeof VALID_MODES)[number])) {
    return apiResponse(null, "Modo inválido", 400);
  }
  if (!VALID_TIMES.includes(timePerQuestion as (typeof VALID_TIMES)[number])) {
    return apiResponse(null, "Tiempo por pregunta inválido", 400);
  }

  // Verificar que todos los bancos existen y el moderador tiene acceso
  const banks = await prisma.questionBank.findMany({
    where: {
      id: { in: bankIdsRaw },
      OR: [{ moderatorId: moderator.id }, { isSystem: true }],
    },
    include: {
      bankQuestions: { select: { questionId: true, order: true } },
    },
  });

  if (banks.length !== bankIdsRaw.length) {
    return apiResponse(null, "Uno o más bancos no encontrados", 404);
  }

  // Combinar preguntas de todos los bancos (sin duplicados)
  const seenQuestionIds = new Set<string>();
  const combinedQuestions: { questionId: string; order: number }[] = [];
  for (const bank of banks) {
    for (const bq of bank.bankQuestions) {
      if (!seenQuestionIds.has(bq.questionId)) {
        seenQuestionIds.add(bq.questionId);
        combinedQuestions.push({ questionId: bq.questionId, order: combinedQuestions.length });
      }
    }
  }

  if (combinedQuestions.length === 0) {
    return apiResponse(null, "Los bancos seleccionados no tienen preguntas", 400);
  }

  // Aplicar límite de preguntas con selección aleatoria
  const requestedCount = typeof questionCount === "number" && questionCount > 0
    ? questionCount
    : combinedQuestions.length;

  const finalQuestions = combinedQuestions.length <= requestedCount
    ? combinedQuestions
    : shuffleArray(combinedQuestions).slice(0, requestedCount);

  const totalRounds = finalQuestions.length;

  // Si hay más de un banco, crear banco combinado temporal para la sesión
  let sessionBankId: string;
  const needsMergedBank = banks.length > 1 || finalQuestions.length < combinedQuestions.length;

  if (!needsMergedBank) {
    sessionBankId = banks[0].id;
  } else {
    const bankNames = banks.map((b) => b.name).join(" + ");
    const mergedBank = await prisma.questionBank.create({
      data: {
        name: `[Partida] ${bankNames}`.slice(0, 100),
        description: `Selección de ${totalRounds} preguntas para partida`,
        isSystem: false,
        moderatorId: moderator.id,
        bankQuestions: {
          create: finalQuestions.map((q, i) => ({
            questionId: q.questionId,
            order: i,
          })),
        },
      },
    });
    sessionBankId = mergedBank.id;
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
      questionBankId: sessionBankId,
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
