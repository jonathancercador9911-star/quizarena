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

  const ownBanks = banks.filter((b) => !b.isSystem && !b.name.startsWith("[Partida]"));
  const systemBanks = banks.filter((b) => b.isSystem);

  // Agrupar bancos propios por categoría
  const ownByCategory = ownBanks.reduce<Record<string, typeof ownBanks>>((acc, b) => {
    const key = b.category ?? "Sin categoría";
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  const categoryOrder = Object.keys(ownByCategory).sort((a, b) =>
    a === "Sin categoría" ? 1 : b === "Sin categoría" ? -1 : a.localeCompare(b)
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Bancos de preguntas</h1>
          <p className="text-[#9CA3AF] mt-1">
            Administra tus bancos o usa los del sistema.
          </p>
        </div>
        <Link href="/banks/new">
          <Button className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white">
            <Plus className="h-4 w-4 mr-1.5" />
            Nuevo banco
          </Button>
        </Link>
      </div>

      {/* Mis bancos agrupados por categoría */}
      {ownBanks.length > 0 ? (
        <div className="space-y-6">
          {categoryOrder.map((cat) => (
            <section key={cat} className="space-y-3">
              <h2 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-2">
                {cat}
                <span className="text-xs font-normal normal-case text-[#4B5563]">
                  ({ownByCategory[cat].length} banco{ownByCategory[cat].length > 1 ? "s" : ""})
                </span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ownByCategory[cat].map((bank) => (
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
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#2D2A3E] p-10 text-center">
          <p className="text-[#9CA3AF]">
            Todavía no tienes bancos propios.{" "}
            <Link href="/banks/new" className="text-[#7C3AED] hover:underline">
              Crea uno
            </Link>{" "}
            o genera preguntas con IA.
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
