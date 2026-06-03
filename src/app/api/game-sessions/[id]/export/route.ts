import { getModerator } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const moderator = await getModerator();
  if (!moderator) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  const session = await prisma.gameSession.findFirst({
    where: { id, moderatorId: moderator.id },
  });
  if (!session) return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });

  const players = await prisma.gamePlayer.findMany({
    where: { gameSessionId: id },
    include: {
      answers: {
        include: { gameRound: { select: { roundNumber: true } } },
        orderBy: { gameRound: { roundNumber: "asc" } },
      },
      team: { select: { name: true } },
    },
    orderBy: { totalScore: "desc" },
  });

  const rows: string[] = [
    "Posición,Nombre,Equipo,Puntuación Total,Respuestas Correctas,Tiempo Promedio (ms)",
  ];

  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    const correctCount = p.answers.filter((a) => a.isCorrect).length;
    const responseTimes = p.answers
      .filter((a) => a.responseMs !== null)
      .map((a) => a.responseMs!);
    const avgMs =
      responseTimes.length > 0
        ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
        : 0;

    rows.push(
      [
        i + 1,
        `"${p.nickname.replace(/"/g, '""')}"`,
        `"${(p.team?.name ?? "").replace(/"/g, '""')}"`,
        p.totalScore,
        correctCount,
        avgMs,
      ].join(",")
    );
  }

  const csv = rows.join("\n");
  const filename = `quizarena-${session.roomCode}-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
