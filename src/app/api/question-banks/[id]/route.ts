import { apiResponse, getModerator } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const moderator = await getModerator();
  if (!moderator) return apiResponse(null, "No autorizado", 401);

  const { id } = await params;

  const bank = await prisma.questionBank.findFirst({
    where: {
      id,
      OR: [{ moderatorId: moderator.id }, { isSystem: true }],
    },
    include: {
      bankQuestions: {
        include: { question: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!bank) return apiResponse(null, "Banco no encontrado", 404);
  return apiResponse(bank, null);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const moderator = await getModerator();
  if (!moderator) return apiResponse(null, "No autorizado", 401);

  const { id } = await params;

  const bank = await prisma.questionBank.findFirst({
    where: { id, moderatorId: moderator.id, isSystem: false },
  });
  if (!bank) return apiResponse(null, "Banco no encontrado", 404);

  const body = (await request.json()) as { name?: unknown; description?: unknown };
  if (typeof body.name !== "string" || body.name.trim() === "") {
    return apiResponse(null, "El nombre es requerido", 400);
  }

  const updated = await prisma.questionBank.update({
    where: { id },
    data: {
      name: body.name.trim(),
      description:
        typeof body.description === "string" ? body.description.trim() : null,
    },
  });

  return apiResponse(updated, null);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const moderator = await getModerator();
  if (!moderator) return apiResponse(null, "No autorizado", 401);

  const { id } = await params;

  const bank = await prisma.questionBank.findFirst({
    where: { id, moderatorId: moderator.id, isSystem: false },
  });
  if (!bank) return apiResponse(null, "Banco no encontrado", 404);

  await prisma.questionBank.delete({ where: { id } });
  return apiResponse({ deleted: true }, null);
}
