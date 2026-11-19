import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./formula-zero.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-fz-display",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-fz-mono",
});

export const metadata: Metadata = {
  title: "Fórmula Zero — Simulador",
  description:
    "HUD de cabina en primera persona y pantalla de carga del simulador Fórmula Zero.",
};

export default function FormulaZeroLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`theme-formula-zero ${spaceGrotesk.variable} ${spaceMono.variable} min-h-screen bg-background font-sans text-foreground`}
    >
      {children}
    </div>
  );
}
