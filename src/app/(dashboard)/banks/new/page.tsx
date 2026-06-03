"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewBankPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/question-banks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    const json = (await res.json()) as { data: { id: string } | null; error: string | null };
    setLoading(false);

    if (json.error || !json.data) {
      setError(json.error ?? "Error al crear el banco");
      return;
    }

    router.push(`/banks/${json.data.id}`);
  }

  return (
    <div className="p-8 max-w-xl">
      <Link
        href="/banks"
        className="inline-flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-[#F8FAFC] mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a bancos
      </Link>

      <Card className="bg-[#1E1B2E] border-[#2D2A3E]">
        <CardHeader>
          <CardTitle className="text-[#F8FAFC]">Nuevo banco de preguntas</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-[#EF4444]/10 border border-[#EF4444]/20 p-3 text-sm text-[#EF4444]">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-[#F8FAFC]">Nombre *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Historia Argentina"
                required
                disabled={loading}
                className="bg-[#13111A] border-[#2D2A3E] text-[#F8FAFC] placeholder:text-[#9CA3AF]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[#F8FAFC]">
                Descripción <span className="text-[#9CA3AF] font-normal">(opcional)</span>
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el contenido de este banco..."
                rows={3}
                disabled={loading}
                className="bg-[#13111A] border-[#2D2A3E] text-[#F8FAFC] placeholder:text-[#9CA3AF] resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Link href="/banks" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-[#2D2A3E] text-[#F8FAFC] hover:bg-[#2D2A3E]"
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                className="flex-1 bg-[#7C3AED] hover:bg-[#5B21B6] text-white"
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear banco"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
