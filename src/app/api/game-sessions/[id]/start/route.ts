import { apiResponse, getModerator } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { broadcastToGame } from "@/lib/supabase/admin";
import { getShuffledOptions } from "@/lib/game/shuffle";
import type { PlayerTeamMap } from "@/lib/game/realtime";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const moderator = await getModerator();
  if (!moderator) return apiResponse(null, "No autorizado", 401);

  const { id } = await params;

  const session = await prisma.gameSession.findFirst({
    where: { id, moderatorId: moderator.id, status: "lobby" },
    include: {
      teams: true,
      questionBank: {
        include: {
          bankQuestions: {
            include: { question: true },
            orderBy: { order: "asc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!session) return apiResponse(null, "Sesión no encontrada o ya iniciada", 404);

  const first = session.questionBank.bankQuestions[0];
  if (!first) return apiResponse(null, "El banco no tiene preguntas", 400);

  const { question } = first;

  // Auto-distribuir jugadores en equipos si es modo equipos
  let playerTeams: PlayerTeamMap | undefined;
  if (session.mode === "teams" && session.teams.length >= 2) {
    const players = await prisma.gamePlayer.findMany({ where: { gameSessionId: id } });
    await Promise.all(
      players.map((player, i) => {
        const team = session.teams[i % session.teams.length];
        return prisma.gamePlayer.update({
          where: { id: player.id },
          data: { teamId: team.id },
        });
      })
    );

    playerTeams = Object.fromEntries(
      players.map((p, i) => {
        const team = session.teams[i % session.teams.length];
        return [p.id, { teamId: team.id, teamName: team.name, teamColor: team.color }];
      })
    );
  }

  const [gameRound] = await prisma.$transaction([
    prisma.gameRound.create({
      data: {
        gameSessionId: session.id,
        questionId: question.id,
        roundNumber: 1,
        startedAt: new Date(),
      },
    }),
    prisma.gameSession.update({
      where: { id: session.id },
      data: { status: "active", currentRound: 1 },
    }),
  ]);

  const shuffled = getShuffledOptions(question, gameRound.id);

  await broadcastToGame(session.roomCode, "game:started", {
    type: "game:started",
    roundId: gameRound.id,
    roundNumber: 1,
    totalRounds: session.totalRounds,
    question: {
      id: question.id,
      text: question.text,
      optionA: shuffled.optionA,
      optionB: shuffled.optionB,
      optionC: shuffled.optionC,
      optionD: shuffled.optionD,
    },
    timePerQuestion: session.timePerQuestion,
    ...(playerTeams && { playerTeams }),
  });

  return apiResponse({ roundId: gameRound.id }, null);
}
