interface FormulaZeroMarkProps {
  className?: string;
}

export function FormulaZeroMark({ className }: FormulaZeroMarkProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <path d="M0 0H78L100 22V100H22L0 78Z" fill="currentColor" />
      <rect x="29" y="14" width="42" height="72" rx="21" className="fill-background" />
      <rect x="40.5" y="26.5" width="19" height="47" rx="9.5" fill="currentColor" />
      <path d="M43 64L54.5 33.5L58 35L46.5 65.5Z" className="fill-background" />
    </svg>
  );
}

interface FormulaZeroLogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
}

export function FormulaZeroLogo({
  className,
  markClassName,
  textClassName,
}: FormulaZeroLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <FormulaZeroMark className={`h-8 w-8 text-primary ${markClassName ?? ""}`} />
      <span
        className={`font-fz-display flex gap-[0.26em] text-xl font-bold tracking-tight text-foreground ${textClassName ?? ""}`}
      >
        <span>FÓRMULA</span>
        <span className="text-primary">ZERO</span>
      </span>
    </div>
  );
}
