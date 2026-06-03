import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="h-16 border-b border-[#2D2A3E] bg-[#13111A]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-6">
        <Link
          href="/"
          className="font-heading font-bold text-xl text-[#F8FAFC] tracking-tight"
        >
          QuizArena
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/play">
            <Button
              variant="outline"
              size="sm"
              className="border-[#2D2A3E] text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#1E1B2E]"
            >
              Unirse a partida
            </Button>
          </Link>

          {user ? (
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white"
              >
                Mi panel
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#9CA3AF] hover:text-[#F8FAFC]"
                >
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white"
                >
                  Crear cuenta
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
