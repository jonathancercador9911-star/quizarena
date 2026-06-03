import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "QuizArena — Trivia multijugador en tiempo real",
  description:
    "Creá partidas de trivia con IA, invitá a tus amigos y jugá en tiempo real desde el celular.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#13111A] text-[#F8FAFC] font-sans">
        {children}
      </body>
    </html>
  );
}
