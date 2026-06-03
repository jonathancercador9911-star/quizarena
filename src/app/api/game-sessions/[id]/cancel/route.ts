import { apiResponse, getModerator } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const moderator = await getModerator();
  if (!moderator) return apiResponse(null, "No autorizado", 401);

  const { id } = await params;

  const session = await prisma.gameSession.findFirst({
    where: { id, moderatorId: moderator.id, status: { not: "finished" } },
  });

  if (!session) return apiResponse(null, "Combate no encontrado o ya finalizado", 404);

  await prisma.gameSession.delete({ where: { id } });

  return apiResponse({ ok: true }, null);
}
