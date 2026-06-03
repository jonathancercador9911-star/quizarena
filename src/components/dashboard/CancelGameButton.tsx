"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  sessionId: string;
  roomCode: string;
}

export function CancelGameButton({ sessionId, roomCode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    if (!confirm(`¿Eliminar el combate ${roomCode}? Esta acción no se puede deshacer.`)) return;
    setLoading(true);
    const res = await fetch(`/api/game-sessions/${sessionId}/cancel`, { method: "DELETE" });
    const json = (await res.json()) as { error: string | null };
    setLoading(false);
    if (json.error) { alert(json.error); return; }
    router.refresh();
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleCancel}
      disabled={loading}
      className="border-[#EF4444]/40 text-[#EF4444] hover:bg-[#EF4444]/10 hover:border-[#EF4444]"
    >
      <Trash2 className="h-3.5 w-3.5 mr-1" />
      {loading ? "Eliminando..." : "Eliminar"}
    </Button>
  );
}
