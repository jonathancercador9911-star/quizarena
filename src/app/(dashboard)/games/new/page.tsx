import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { CreateGameWizard } from "@/components/dashboard/CreateGameWizard";

export default async function NewGamePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const moderator = await prisma.moderator.findUnique({ where: { authId: user.id } });
  if (!moderator) redirect("/login");

  const banks = await prisma.questionBank.findMany({
    where: {
      OR: [{ moderatorId: moderator.id }, { isSystem: true }],
    },
    include: { _count: { select: { bankQuestions: true } } },
    orderBy: [{ isSystem: "desc" }, { name: "asc" }],
  });

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#F8FAFC] mb-2">Nueva partida</h1>
      <p className="text-[#9CA3AF] mb-8">Configurá la sesión de juego paso a paso.</p>
      <CreateGameWizard banks={banks.map((b) => ({ id: b.id, name: b.name, questionCount: b._count.bankQuestions }))} />
    </div>
  );
}
