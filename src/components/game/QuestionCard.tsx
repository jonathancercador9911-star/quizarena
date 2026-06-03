interface QuestionCardProps {
  text: string;
  roundNumber: number;
  totalRounds: number;
}

export function QuestionCard({ text, roundNumber, totalRounds }: QuestionCardProps) {
  return (
    <div className="w-full rounded-2xl bg-[#1E1B2E] border border-[#2D2A3E] p-6 text-center space-y-3">
      <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-widest">
        Pregunta {roundNumber} de {totalRounds}
      </p>
      <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] leading-snug">
        {text}
      </h2>
    </div>
  );
}
