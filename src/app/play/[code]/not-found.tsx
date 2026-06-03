import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RoomNotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
      <div className="text-5xl mb-4">🚪</div>
      <h2 className="text-xl font-bold text-[#F8FAFC] mb-2">Sala no encontrada</h2>
      <p className="text-[#9CA3AF] text-sm mb-6">
        El código no existe, la partida ya terminó o fue cancelada.
      </p>
      <Link href="/play">
        <Button className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white">
          Intentar con otro código
        </Button>
      </Link>
    </div>
  );
}
