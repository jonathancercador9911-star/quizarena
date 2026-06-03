import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, BookOpen, Trophy, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATUS_COLOR: Record<string, string> = {
  lobby: "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30",
  active: "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30",
  finished: "bg-[#9CA3AF]/20 text-[#9CA3AF] border-[#9CA3AF]/30",
};
const STATUS_LABEL: Record<string, string> = {
  lobby: "Sala de espera",
  active: "En curso",
  finished: "Finalizada",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const moderator = await prisma.moderator.findUnique({ where: { authId: user.id } });
  if (!moderator) redirect("/login");

  const [bankCount, gameCount, recentGames] = await Promise.all([
    prisma.questionBank.count({ where: { OR: [{ moderatorId: moderator.id }, { isSystem: true }] } }),
    prisma.gameSession.count({ where: { moderatorId: moderator.id } }),
    prisma.gameSession.findMany({
      where: { moderatorId: moderator.id },
      include: {
        questionBank: { select: { name: true } },
        _count: { select: { players: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const activeGames = recentGames.filter((g) => g.status !== "finished");

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">
            Hola, {moderator.name ?? user.email?.split("@")[0]} 👋
          </h1>
          <p className="text-[#9CA3AF] mt-1">Acá está el resumen de tu actividad.</p>
        </div>
        <Link href="/games/new">
          <Button className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white">
            <Plus className="h-4 w-4 mr-1.5" />
            Nueva partida
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: BookOpen, label: "Bancos disponibles", value: bankCount, href: "/banks" },
          { icon: Trophy, label: "Partidas jugadas", value: gameCount, href: "/games" },
          { icon: Users, label: "Partidas activas", value: activeGames.length, href: "/games" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="rounded-xl border border-[#2D2A3E] bg-[#1E1B2E] p-5 flex items-center gap-4 hover:border-[#7C3AED]/50 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-[#7C3AED]/15 flex items-center justify-center shrink-0">
                <stat.icon className="h-5 w-5 text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-2xl font-bold font-heading text-[#F8FAFC]">{stat.value}</p>
                <p className="text-xs text-[#9CA3AF]">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent games */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-[#9CA3AF] uppercase tracking-wider">
            Partidas recientes
          </h2>
          <Link href="/games" className="text-xs text-[#7C3AED] hover:underline">
            Ver todas
          </Link>
        </div>

        {recentGames.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#2D2A3E] p-10 text-center">
            <Trophy className="h-8 w-8 text-[#2D2A3E] mx-auto mb-3" />
            <p className="text-[#9CA3AF] text-sm">
              Todavía no jugaste ninguna partida.{" "}
              <Link href="/games/new" className="text-[#7C3AED] hover:underline">
                Creá una
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-[#2D2A3E] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2D2A3E] bg-[#1E1B2E]">
                  <th className="text-left px-4 py-3 text-[#9CA3AF] font-medium">Código</th>
                  <th className="text-left px-4 py-3 text-[#9CA3AF] font-medium hidden sm:table-cell">Banco</th>
                  <th className="text-left px-4 py-3 text-[#9CA3AF] font-medium">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {recentGames.map((g) => (
                  <tr key={g.id} className="border-b border-[#2D2A3E] last:border-0 hover:bg-[#1E1B2E]/50">
                    <td className="px-4 py-3 font-mono font-bold tracking-widest text-[#F8FAFC]">
                      {g.roomCode}
                    </td>
                    <td className="px-4 py-3 text-[#9CA3AF] hidden sm:table-cell">
                      {g.questionBank.name}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={STATUS_COLOR[g.status] ?? ""}>
                        {STATUS_LABEL[g.status] ?? g.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {g.status !== "finished" && (
                        <Link href={`/games/${g.id}/${g.status === "lobby" ? "lobby" : "control"}`}>
                          <Button size="sm" variant="outline"
                            className="border-[#2D2A3E] text-[#F8FAFC] hover:bg-[#2D2A3E] text-xs">
                            {g.status === "lobby" ? "Ir al lobby" : "Controlar"}
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
