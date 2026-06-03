import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#13111A] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-heading font-extrabold text-[#2D2A3E] mb-4">404</p>
      <h1 className="text-2xl font-bold text-[#F8FAFC] mb-2">Página no encontrada</h1>
      <p className="text-[#9CA3AF] mb-8">
        La página que buscás no existe o fue movida.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white">
            Ir al inicio
          </Button>
        </Link>
        <Link href="/play">
          <Button variant="outline" className="border-[#2D2A3E] text-[#F8FAFC] hover:bg-[#1E1B2E]">
            Unirse a partida
          </Button>
        </Link>
      </div>
    </div>
  );
}
