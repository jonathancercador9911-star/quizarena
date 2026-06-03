"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  seconds: number;
  onExpire: () => void;
  paused?: boolean;
}

export function CountdownTimer({ seconds, onExpire, paused = false }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (paused || remaining <= 0) {
      if (remaining <= 0) onExpire();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, paused, onExpire]);

  const pct = remaining / seconds;
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - pct);

  const color =
    pct > 0.5 ? "#10B981" : pct > 0.25 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={radius} stroke="#2D2A3E" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
        />
      </svg>
      <span
        className={cn(
          "absolute text-2xl font-heading font-extrabold",
          remaining <= 3 && "animate-pulse"
        )}
        style={{ color, marginTop: "-62px" }}
      >
        {remaining}
      </span>
    </div>
  );
}
