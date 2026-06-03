"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PlayError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Play error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold text-[#F8FAFC] mb-2">
        Se perdió la conexión
      </h2>
      <p className="text-[#9CA3AF] text-sm mb-6 max-w-xs">
        Hubo un problema con la conexión en tiempo real. Intentá reconectarte.
      </p>
      <div className="flex gap-3">
        <Button
          onClick={reset}
          className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white"
        >
          Reintentar
        </Button>
        <Link href="/play">
          <Button
            variant="outline"
            className="border-[#2D2A3E] text-[#F8FAFC] hover:bg-[#1E1B2E]"
          >
            Volver
          </Button>
        </Link>
      </div>
    </div>
  );
}
