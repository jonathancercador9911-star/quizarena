import { Navbar } from "@/components/shared/Navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[#2D2A3E] py-6 text-center text-sm text-[#9CA3AF]">
        © 2026 QuizArena
      </footer>
    </div>
  );
}
