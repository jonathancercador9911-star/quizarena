import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { GameControlPanel } from "@/components/dashboard/GameControlPanel";
import { RoomCodeDisplay } from "@/components/shared/RoomCodeDisplay";

export default async function GameControlPage({
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
  });
  if (!session) notFound();
  if (session.status === "lobby") redirect(`/games/${id}/lobby`);
  if (session.status === "finished") redirect(`/games`);

  const currentRound = await prisma.gameRound.findFirst({
    where: { gameSessionId: id, roundNumber: session.currentRound },
    include: { question: { select: { text: true } } },
  });
  if (!currentRound) notFound();

  const totalPlayers = await prisma.gamePlayer.count({ where: { gameSessionId: id } });

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Control de partida</h1>
          <p className="text-[#9CA3AF] mt-1">
            Banco: {(await prisma.questionBank.findUnique({ where: { id: session.questionBankId }, select: { name: true } }))?.name}
          </p>
        </div>
        <RoomCodeDisplay code={session.roomCode} size="md" />
      </div>

      <GameControlPanel
        sessionId={session.id}
        roomCode={session.roomCode}
        totalRounds={session.totalRounds}
        initialRound={{
          id: currentRound.id,
          roundNumber: currentRound.roundNumber,
          question: { text: currentRound.question.text },
        }}
        totalPlayers={totalPlayers}
        timerStarted={currentRound.startedAt !== null}
      />
    </div>
  );
}
