"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QuestionEditorProps {
  bankId: string;
  isSystem: boolean;
}

const EMPTY_FORM = {
  text: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "A" as "A" | "B" | "C" | "D",
  difficulty: "medium" as "easy" | "medium" | "hard",
};

export function QuestionEditor({ bankId, isSystem }: QuestionEditorProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isSystem) return null;

  function handleClose() {
    setOpen(false);
    setForm(EMPTY_FORM);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/question-banks/${bankId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = (await res.json()) as { error: string | null };
    setLoading(false);

    if (json.error) {
      setError(json.error);
      return;
    }

    handleClose();
    router.refresh();
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white"
      >
        <Plus className="h-4 w-4 mr-1.5" />
        Agregar pregunta
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E1B2E] border border-[#2D2A3E] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#2D2A3E]">
              <h2 className="text-lg font-semibold text-[#F8FAFC]">
                Nueva pregunta
              </h2>
              <button
                onClick={handleClose}
                className="text-[#9CA3AF] hover:text-[#F8FAFC] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="rounded-md bg-[#EF4444]/10 border border-[#EF4444]/20 p-3 text-sm text-[#EF4444]">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-[#F8FAFC]">Pregunta</Label>
                <Textarea
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="Escribe la pregunta aquí..."
                  required
                  rows={3}
                  className="bg-[#13111A] border-[#2D2A3E] text-[#F8FAFC] placeholder:text-[#9CA3AF] resize-none"
                />
              </div>

              {(["A", "B", "C", "D"] as const).map((opt) => (
                <div key={opt} className="space-y-1.5">
                  <Label className="text-[#F8FAFC]">Opción {opt}</Label>
                  <Input
                    value={form[`option${opt}` as keyof typeof form] as string}
                    onChange={(e) =>
                      setForm({ ...form, [`option${opt}`]: e.target.value })
                    }
                    placeholder={`Opción ${opt}`}
                    required
                    className="bg-[#13111A] border-[#2D2A3E] text-[#F8FAFC] placeholder:text-[#9CA3AF]"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[#F8FAFC]">Respuesta correcta</Label>
                  <select
                    value={form.correctOption}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        correctOption: e.target.value as "A" | "B" | "C" | "D",
                      })
                    }
                    className="w-full h-9 rounded-md border border-[#2D2A3E] bg-[#13111A] text-[#F8FAFC] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  >
                    {["A", "B", "C", "D"].map((o) => (
                      <option key={o} value={o}>
                        Opción {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[#F8FAFC]">Dificultad</Label>
                  <select
                    value={form.difficulty}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        difficulty: e.target.value as "easy" | "medium" | "hard",
                      })
                    }
                    className="w-full h-9 rounded-md border border-[#2D2A3E] bg-[#13111A] text-[#F8FAFC] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  >
                    <option value="easy">Fácil</option>
                    <option value="medium">Medio</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-[#2D2A3E] text-[#F8FAFC] hover:bg-[#2D2A3E]"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#7C3AED] hover:bg-[#5B21B6] text-white"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar pregunta"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
