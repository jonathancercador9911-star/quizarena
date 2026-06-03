import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATUS_LABEL: Record<string, string> = {
  lobby: "Sala de espera",
  active: "En curso",
  finished: "Finalizada",
};
const STATUS_COLOR: Record<string, string> = {
  lobby: "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30",
  active: "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30",
  finished: "bg-[#9CA3AF]/20 text-[#9CA3AF] border-[#9CA3AF]/30",
};

export default async function GamesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const moderator = await prisma.moderator.findUnique({ where: { authId: user.id } });
  if (!moderator) redirect("/login");

  const sessions = await prisma.gameSession.findMany({
    where: { moderatorId: moderator.id },
    include: {
      questionBank: { select: { name: true } },
      _count: { select: { players: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Partidas</h1>
          <p className="text-[#9CA3AF] mt-1">Historial de tus sesiones de juego.</p>
        </div>
        <Link href="/games/new">
          <Button className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white">
            <Plus className="h-4 w-4 mr-1.5" />
            Nueva partida
          </Button>
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#2D2A3E] p-16 text-center">
          <Trophy className="h-10 w-10 text-[#2D2A3E] mx-auto mb-4" />
          <p className="text-[#9CA3AF] text-sm">
            Todavía no jugaste ninguna partida.{" "}
            <Link href="/games/new" className="text-[#7C3AED] hover:underline">
              Creá una ahora
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
                <th className="text-left px-4 py-3 text-[#9CA3AF] font-medium">Banco</th>
                <th className="text-left px-4 py-3 text-[#9CA3AF] font-medium">Estado</th>
                <th className="text-left px-4 py-3 text-[#9CA3AF] font-medium">Jugadores</th>
                <th className="text-left px-4 py-3 text-[#9CA3AF] font-medium">Fecha</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-b border-[#2D2A3E] last:border-0 hover:bg-[#1E1B2E]/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#F8FAFC] tracking-widest">
                    {s.roomCode}
                  </td>
                  <td className="px-4 py-3 text-[#9CA3AF]">{s.questionBank.name}</td>
                  <td className="px-4 py-3">
                    <Badge className={STATUS_COLOR[s.status] ?? ""}>
                      {STATUS_LABEL[s.status] ?? s.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[#9CA3AF]">{s._count.players}</td>
                  <td className="px-4 py-3 text-[#9CA3AF]">
                    {s.createdAt.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.status !== "finished" && (
                      <Link href={`/games/${s.id}/${s.status === "lobby" ? "lobby" : "control"}`}>
                        <Button size="sm" variant="outline" className="border-[#2D2A3E] text-[#F8FAFC] hover:bg-[#2D2A3E]">
                          {s.status === "lobby" ? "Sala" : "Control"}
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
  );
}
