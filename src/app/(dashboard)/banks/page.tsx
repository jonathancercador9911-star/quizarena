import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { BankCard } from "@/components/dashboard/BankCard";

export default async function BanksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const moderator = await prisma.moderator.findUnique({
    where: { authId: user.id },
  });
  if (!moderator) redirect("/login");

  const banks = await prisma.questionBank.findMany({
    where: { OR: [{ moderatorId: moderator.id }, { isSystem: true }] },
    include: { _count: { select: { bankQuestions: true } } },
    orderBy: [{ isSystem: "desc" }, { createdAt: "desc" }],
  });

  const ownBanks = banks.filter((b) => !b.isSystem);
  const systemBanks = banks.filter((b) => b.isSystem);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Bancos de preguntas</h1>
          <p className="text-[#9CA3AF] mt-1">
            Administrá tus bancos o usá los del sistema.
          </p>
        </div>
        <Link href="/banks/new">
          <Button className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white">
            <Plus className="h-4 w-4 mr-1.5" />
            Nuevo banco
          </Button>
        </Link>
      </div>

      {ownBanks.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider">
            Mis bancos
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ownBanks.map((bank) => (
              <BankCard
                key={bank.id}
                id={bank.id}
                name={bank.name}
                description={bank.description}
                questionCount={bank._count.bankQuestions}
                isSystem={false}
              />
            ))}
          </div>
        </section>
      )}

      {ownBanks.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#2D2A3E] p-10 text-center">
          <p className="text-[#9CA3AF]">
            Todavía no tenés bancos propios.{" "}
            <Link href="/banks/new" className="text-[#7C3AED] hover:underline">
              Creá uno
            </Link>{" "}
            o generá preguntas con IA.
          </p>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider">
          Bancos del sistema
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {systemBanks.map((bank) => (
            <BankCard
              key={bank.id}
              id={bank.id}
              name={bank.name}
              description={bank.description}
              questionCount={bank._count.bankQuestions}
              isSystem={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
