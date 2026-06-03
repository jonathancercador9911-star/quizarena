import { cn } from "@/lib/utils";

const OPTION_STYLES = {
  A: { bg: "bg-[#EF4444]", hover: "hover:bg-[#DC2626]", label: "A" },
  B: { bg: "bg-[#3B82F6]", hover: "hover:bg-[#2563EB]", label: "B" },
  C: { bg: "bg-[#F59E0B]", hover: "hover:bg-[#D97706]", label: "C" },
  D: { bg: "bg-[#10B981]", hover: "hover:bg-[#059669]", label: "D" },
} as const;

interface AnswerButtonsProps {
  options: { A: string; B: string; C: string; D: string };
  selected: string | null;
  disabled: boolean;
  onSelect: (option: "A" | "B" | "C" | "D") => void;
}

export function AnswerButtons({
  options,
  selected,
  disabled,
  onSelect,
}: AnswerButtonsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {(["A", "B", "C", "D"] as const).map((opt) => {
        const style = OPTION_STYLES[opt];
        const isSelected = selected === opt;
        const isAnswered = selected !== null;

        return (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            disabled={disabled}
            className={cn(
              "flex items-center gap-3 w-full min-h-[64px] rounded-xl px-4 py-3 text-left font-semibold text-white transition-all duration-150",
              style.bg,
              !isAnswered && !disabled && style.hover,
              isSelected && "ring-4 ring-white ring-offset-2 ring-offset-[#13111A]",
              isAnswered && !isSelected && "opacity-40",
              disabled && !isAnswered && "cursor-not-allowed opacity-60"
            )}
          >
            <span className="flex-shrink-0 h-8 w-8 rounded-lg bg-black/20 flex items-center justify-center text-sm font-bold">
              {opt}
            </span>
            <span className="text-sm sm:text-base leading-snug">{options[opt]}</span>
          </button>
        );
      })}
    </div>
  );
}
