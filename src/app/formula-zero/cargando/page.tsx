"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormulaZeroLogo } from "@/components/formula-zero/Logo";
import { CarLiverySide } from "@/components/formula-zero/CarLivery";

const TRACK_PATH =
  "M150 450L620 450Q700 450 720 390L760 260Q780 200 840 200L880 200Q930 200 930 150Q930 100 880 100L520 100Q470 100 460 150L440 260Q430 310 380 310L260 310Q200 310 190 250L180 190Q170 130 120 140Q70 150 80 220L100 380Q110 450 150 450Z";

/** Pantalla de carga del simulador: trazado en planta del Circuito Zero-One con barra de progreso. */
export default function FormulaZeroLoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(100, p + Math.random() * 9 + 3));
    }, 220);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const t = setTimeout(() => router.push("/formula-zero"), 400);
    return () => clearTimeout(t);
  }, [progress, router]);

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-background p-8 sm:p-16">
      <svg
        viewBox="0 0 1920 1080"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
        preserveAspectRatio="xMidYMid slice"
      >
        <text
          x="1760"
          y="1060"
          textAnchor="middle"
          fontFamily="Space Grotesk, sans-serif"
          fontWeight={700}
          fontSize={1300}
          fill="none"
          className="stroke-muted"
          strokeWidth={3}
        >
          0
        </text>
        <line x1="0" y1="140" x2="1920" y2="140" className="stroke-muted" />
        <line x1="0" y1="960" x2="1920" y2="960" className="stroke-muted" />
      </svg>

      <FormulaZeroLogo className="relative z-10" />

      <div className="relative z-10 mt-auto flex flex-1 flex-col items-center justify-center gap-8 sm:flex-row sm:items-center sm:justify-between">
        <svg
          viewBox="20 50 980 460"
          role="img"
          aria-label="Trazado en planta del Circuito Zero-One"
          className="w-full max-w-xl"
        >
          <path d={TRACK_PATH} fill="none" className="stroke-muted" strokeWidth={30} strokeLinejoin="round" />
          <path d={TRACK_PATH} fill="none" className="stroke-primary" strokeWidth={5} strokeLinejoin="round" />
        </svg>
        <div className="font-fz-display flex flex-col text-center text-5xl font-bold leading-[0.9] tracking-tight sm:text-right sm:text-8xl">
          <span>CIRCUITO</span>
          <span className="text-primary">ZERO-ONE</span>
        </div>
      </div>

      <CarLiverySide className="pointer-events-none absolute -right-10 bottom-10 hidden w-[42rem] opacity-90 lg:block" />

      <div className="font-fz-mono relative z-10 mt-10 flex items-center gap-6">
        <span className="text-sm font-bold tracking-widest text-muted-foreground">CARGANDO</span>
        <div className="h-1 flex-1 bg-muted">
          <div className="h-1 bg-primary transition-[width]" style={{ width: `${progress}%` }} />
        </div>
        <span className="w-14 text-right text-sm font-bold tabular-nums">{Math.round(progress)}%</span>
      </div>
    </main>
  );
}
