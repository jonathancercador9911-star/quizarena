import type { Metadata } from "next";
import { CockpitBackdrop } from "@/components/formula-zero/CockpitBackdrop";
import { CockpitHud } from "@/components/formula-zero/CockpitHud";

export const metadata: Metadata = {
  title: "Cabina — Fórmula Zero",
};

export default function FormulaZeroCockpitPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <CockpitBackdrop />
      <CockpitHud />
    </main>
  );
}
