import { apiResponse, getModerator } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const VALID_OPTIONS = ["A", "B", "C", "D"] as const;
const VALID_DIFFICULTIES = ["easy", "medium", "hard"] as const;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const moderator = await getModerator();
  if (!moderator) return apiResponse(null, "No autorizado", 401);

  const { id: bankId } = await params;

  const bank = await prisma.questionBank.findFirst({
    where: {
      id: bankId,
      OR: [{ moderatorId: moderator.id }, { isSystem: false }],
      moderatorId: moderator.id,
    },
  });
  if (!bank) return apiResponse(null, "Banco no encontrado o sin permisos", 404);

  const body = (await request.json()) as Record<string, unknown>;

  const { text, optionA, optionB, optionC, optionD, correctOption, difficulty } =
    body;

  if (
    typeof text !== "string" || text.trim() === "" ||
    typeof optionA !== "string" || optionA.trim() === "" ||
    typeof optionB !== "string" || optionB.trim() === "" ||
    typeof optionC !== "string" || optionC.trim() === "" ||
    typeof optionD !== "string" || optionD.trim() === "" ||
    !VALID_OPTIONS.includes(correctOption as (typeof VALID_OPTIONS)[number]) ||
    !VALID_DIFFICULTIES.includes(difficulty as (typeof VALID_DIFFICULTIES)[number])
  ) {
    return apiResponse(null, "Datos de pregunta inválidos", 400);
  }

  const maxOrderResult = await prisma.bankQuestion.aggregate({
    where: { questionBankId: bankId },
    _max: { order: true },
  });
  const nextOrder = (maxOrderResult._max.order ?? -1) + 1;

  const question = await prisma.question.create({
    data: {
      text: (text as string).trim(),
      optionA: (optionA as string).trim(),
      optionB: (optionB as string).trim(),
      optionC: (optionC as string).trim(),
      optionD: (optionD as string).trim(),
      correctOption: correctOption as string,
      difficulty: difficulty as string,
      aiGenerated: false,
    },
  });

  await prisma.bankQuestion.create({
    data: { questionBankId: bankId, questionId: question.id, order: nextOrder },
  });

  return apiResponse(question, null, 201);
}
