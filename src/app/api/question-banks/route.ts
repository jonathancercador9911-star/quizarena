import { apiResponse, getModerator } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const moderator = await getModerator();
  if (!moderator) return apiResponse(null, "No autorizado", 401);

  const banks = await prisma.questionBank.findMany({
    where: {
      OR: [{ moderatorId: moderator.id }, { isSystem: true }],
    },
    include: { _count: { select: { bankQuestions: true } } },
    orderBy: [{ isSystem: "desc" }, { createdAt: "desc" }],
  });

  return apiResponse(banks, null);
}

export async function POST(request: Request) {
  const moderator = await getModerator();
  if (!moderator) return apiResponse(null, "No autorizado", 401);

  const body = (await request.json()) as { name?: unknown; description?: unknown; category?: unknown };

  if (typeof body.name !== "string" || body.name.trim() === "") {
    return apiResponse(null, "El nombre es requerido", 400);
  }

  const bank = await prisma.questionBank.create({
    data: {
      name: body.name.trim(),
      description: typeof body.description === "string" ? body.description.trim() : null,
      category: typeof body.category === "string" && body.category.trim() ? body.category.trim() : null,
      moderatorId: moderator.id,
      isSystem: false,
    },
  });

  return apiResponse(bank, null, 201);
}
