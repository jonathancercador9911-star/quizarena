import { apiResponse, getModerator } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { broadcastToGame } from "@/lib/supabase/admin";
import { calculateGameStats } from "@/lib/game/stats";
import { getShuffledOptions } from "@/lib/game/shuffle";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const moderator = await getModerator();
  if (!moderator) return apiResponse(null, "No autorizado", 401);

  const { id } = await params;

  const session = await prisma.gameSession.findFirst({
    where: { id, moderatorId: moderator.id, status: "active" },
  });
  if (!session) return apiResponse(null, "Sesión no encontrada o no activa", 404);

  const currentRound = await prisma.gameRound.findFirst({
    where: { gameSessionId: id, roundNumber: session.currentRound, finishedAt: null },
    include: {
      answers: { include: { gamePlayer: true } },
      question: true,
    },
  });
  if (!currentRound) return apiResponse(null, "Ronda activa no encontrada", 404);

  // Crear respuestas vacías para jugadores que no respondieron
  const allPlayers = await prisma.gamePlayer.findMany({ where: { gameSessionId: id } });
  const answeredIds = new Set(currentRound.answers.map((a) => a.gamePlayerId));
  const unanswered = allPlayers.filter((p) => !answeredIds.has(p.id));

  if (unanswered.length > 0) {
    await prisma.playerAnswer.createMany({
      data: unanswered.map((p) => ({
        gameRoundId: currentRound.id,
        gamePlayerId: p.id,
        selectedOption: null,
        isCorrect: false,
        score: 0,
      })),
    });
  }

  // Cerrar ronda
  await prisma.gameRound.update({
    where: { id: currentRound.id },
    data: { finishedAt: new Date() },
  });

  // Actualizar totalScore de cada jugador
  const allAnswers = await prisma.playerAnswer.findMany({
    where: { gameRoundId: currentRound.id },
  });
  await Promise.all(
    allAnswers.map((a) =>
      prisma.gamePlayer.update({
        where: { id: a.gamePlayerId },
        data: { totalScore: { increment: a.score } },
      })
    )
  );

  // Calcular leaderboard individual
  const players = await prisma.gamePlayer.findMany({
    where: { gameSessionId: id },
    orderBy: { totalScore: "desc" },
    include: { team: true },
  });
  const leaderboard = players.map((p, i) => {
    const roundAnswer = allAnswers.find((a) => a.gamePlayerId === p.id);
    return {
      playerId: p.id,
      nickname: p.nickname,
      totalScore: p.totalScore + (roundAnswer?.score ?? 0),
      rank: i + 1,
      scoreDelta: roundAnswer?.score ?? 0,
    };
  });

  // Calcular leaderboard de equipos (solo si modo equipos)
  let teamLeaderboard: { teamId: string; name: string; color: string; totalScore: number }[] | undefined;
  if (session.mode === "teams") {
    const teams = await prisma.team.findMany({ where: { gameSessionId: id } });
    const teamScores = new Map<string, number>();
    for (const p of players) {
      if (p.teamId) {
        const roundScore = allAnswers.find((a) => a.gamePlayerId === p.id)?.score ?? 0;
        teamScores.set(p.teamId, (teamScores.get(p.teamId) ?? 0) + p.totalScore + roundScore);
      }
    }
    teamLeaderboard = teams
      .map((t) => ({ teamId: t.id, name: t.name, color: t.color, totalScore: teamScores.get(t.id) ?? 0 }))
      .sort((a, b) => b.totalScore - a.totalScore);
  }

  await broadcastToGame(session.roomCode, "leaderboard:show", {
    type: "leaderboard:show",
    leaderboard,
    ...(teamLeaderboard && { teamLeaderboard }),
  });

  const isLastRound = session.currentRound >= session.totalRounds;

  if (isLastRound) {
    await prisma.gameSession.update({
      where: { id },
      data: { status: "finished", finishedAt: new Date() },
    });
    const stats = await calculateGameStats(id, session.totalRounds);
    await broadcastToGame(session.roomCode, "game:ended", {
      type: "game:ended",
      finalLeaderboard: leaderboard,
      stats,
    });
    return apiResponse({ finished: true }, null);
  }

  // Esperar 5s y avanzar a la siguiente pregunta
  await new Promise((r) => setTimeout(r, 5000));

  const allBankQuestions = await prisma.bankQuestion.findMany({
    where: { questionBankId: session.questionBankId },
    include: { question: true },
    orderBy: { order: "asc" },
  });
  const nextQuestion = allBankQuestions[session.currentRound]; // 0-based index = currentRound
  if (!nextQuestion) return apiResponse(null, "No hay más preguntas", 500);

  const nextRoundNumber = session.currentRound + 1;
  const nextRound = await prisma.gameRound.create({
    data: {
      gameSessionId: id,
      questionId: nextQuestion.question.id,
      roundNumber: nextRoundNumber,
      startedAt: new Date(),
    },
  });

  await prisma.gameSession.update({
    where: { id },
    data: { currentRound: nextRoundNumber },
  });

  const shuffled = getShuffledOptions(nextQuestion.question, nextRound.id);

  await broadcastToGame(session.roomCode, "question:show", {
    type: "question:show",
    roundId: nextRound.id,
    roundNumber: nextRoundNumber,
    totalRounds: session.totalRounds,
    question: {
      id: nextQuestion.question.id,
      text: nextQuestion.question.text,
      optionA: shuffled.optionA,
      optionB: shuffled.optionB,
      optionC: shuffled.optionC,
      optionD: shuffled.optionD,
    },
    timePerQuestion: session.timePerQuestion,
  });

  return apiResponse({ roundNumber: nextRoundNumber }, null);
}
