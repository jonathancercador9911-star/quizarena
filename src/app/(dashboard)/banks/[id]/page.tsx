import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuestionEditor } from "@/components/dashboard/QuestionEditor";

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Fácil",
  medium: "Medio",
  hard: "Difícil",
};

const CORRECT_COLOR: Record<string, string> = {
  A: "text-[#EF4444]",
  B: "text-[#3B82F6]",
  C: "text-[#F59E0B]",
  D: "text-[#10B981]",
};

export default async function BankDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const moderator = await prisma.moderator.findUnique({
    where: { authId: user.id },
  });
  if (!moderator) redirect("/login");

  const { id } = await params;

  const bank = await prisma.questionBank.findFirst({
    where: {
      id,
      OR: [{ moderatorId: moderator.id }, { isSystem: true }],
    },
    include: {
      bankQuestions: {
        include: { question: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!bank) notFound();

  const isOwn = bank.moderatorId === moderator.id;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/banks"
            className="inline-flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-[#F8FAFC] mb-3 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a bancos
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#F8FAFC]">{bank.name}</h1>
            <Badge
              className={
                bank.isSystem
                  ? "bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30"
                  : "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30"
              }
            >
              {bank.isSystem ? "Sistema" : "Propio"}
            </Badge>
          </div>
          {bank.description && (
            <p className="text-[#9CA3AF] mt-1">{bank.description}</p>
          )}
          <p className="text-sm text-[#9CA3AF] mt-2">
            {bank.bankQuestions.length} preguntas en este banco
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          {isOwn && (
            <Link href={`/banks/${id}/generate`}>
              <Button
                variant="outline"
                className="border-[#2D2A3E] text-[#F8FAFC] hover:bg-[#2D2A3E]"
              >
                <Sparkles className="h-4 w-4 mr-1.5" />
                Generar con IA
              </Button>
            </Link>
          )}
          <QuestionEditor bankId={id} isSystem={bank.isSystem} />
        </div>
      </div>

      {bank.bankQuestions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#2D2A3E] p-10 text-center">
          <p className="text-[#9CA3AF]">
            {bank.isSystem
              ? "Este banco del sistema no tiene preguntas."
              : "Este banco está vacío. Agrega preguntas manualmente o genera con IA."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bank.bankQuestions.map((bq, index) => {
            const q = bq.question;
            return (
              <div
                key={bq.id}
                className="rounded-xl border border-[#2D2A3E] bg-[#1E1B2E] p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-[#9CA3AF] mt-0.5 w-5 shrink-0">
                      {index + 1}.
                    </span>
                    <p className="text-[#F8FAFC] text-sm font-medium leading-snug">
                      {q.text}
                    </p>
                  </div>
                  <Badge className="shrink-0 text-xs bg-[#13111A] text-[#9CA3AF] border-[#2D2A3E]">
                    {DIFFICULTY_LABEL[q.difficulty] ?? q.difficulty}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-1.5 ml-8">
                  {(["A", "B", "C", "D"] as const).map((opt) => {
                    const isCorrect = q.correctOption === opt;
                    return (
                      <div
                        key={opt}
                        className={`flex items-center gap-1.5 text-xs rounded px-2 py-1 ${
                          isCorrect
                            ? "bg-[#10B981]/10 border border-[#10B981]/20"
                            : "text-[#9CA3AF]"
                        }`}
                      >
                        <span
                          className={`font-bold ${
                            isCorrect ? "text-[#10B981]" : CORRECT_COLOR[opt]
                          }`}
                        >
                          {opt}.
                        </span>
                        <span className={isCorrect ? "text-[#10B981]" : ""}>
                          {q[`option${opt}` as keyof typeof q] as string}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
