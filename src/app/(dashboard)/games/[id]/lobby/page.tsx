import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { ModeratorLobby } from "@/components/dashboard/ModeratorLobby";

export default async function ModeratorLobbyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const moderator = await prisma.moderator.findUnique({ where: { authId: user.id } });
  if (!moderator) redirect("/login");

  const { id } = await params;

  const session = await prisma.gameSession.findFirst({
    where: { id, moderatorId: moderator.id },
    include: { teams: true },
  });

  if (!session) notFound();

  if (session.status === "active") redirect(`/games/${id}/control`);
  if (session.status === "finished") redirect(`/games`);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Sala de espera</h1>
        <p className="text-[#9CA3AF] mt-1">
          Espera que se unan los jugadores y luego inicia la partida.
        </p>
      </div>

      <ModeratorLobby
        sessionId={session.id}
        roomCode={session.roomCode}
        mode={session.mode}
        teams={session.teams}
        totalRounds={session.totalRounds}
      />
    </div>
  );
}
