"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Bank { id: string; name: string; questionCount: number }

interface Props { banks: Bank[] }

interface Team { name: string; color: string }

const TEAM_COLORS = [
  "#EF4444", "#3B82F6", "#F59E0B", "#10B981",
  "#8B5CF6", "#EC4899", "#F97316", "#06B6D4",
];

const DEFAULT_TEAMS: Team[] = [
  { name: "Equipo Rojo", color: "#EF4444" },
  { name: "Equipo Azul", color: "#3B82F6" },
];

const STEPS = ["Banco", "Modo", "Equipos", "Tiempo"];

export function CreateGameWizard({ banks }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [bankIds, setBankIds] = useState<string[]>([]);
  const [mode, setMode] = useState<"individual" | "teams">("individual");
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [time, setTime] = useState<10 | 20 | 30>(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleBank(id: string) {
    setBankIds((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
    setError(null);
  }

  const totalQuestions = banks
    .filter((b) => bankIds.includes(b.id))
    .reduce((sum, b) => sum + b.questionCount, 0);

  const maxStep = mode === "individual" ? 3 : 3;
  const steps = mode === "individual"
    ? ["Banco", "Modo", "Tiempo"]
    : ["Banco", "Modo", "Equipos", "Tiempo"];

  function addTeam() {
    if (teams.length >= 8) return;
    const usedColors = teams.map((t) => t.color);
    const color = TEAM_COLORS.find((c) => !usedColors.includes(c)) ?? TEAM_COLORS[0];
    setTeams([...teams, { name: `Equipo ${teams.length + 1}`, color }]);
  }

  function removeTeam(i: number) {
    if (teams.length <= 2) return;
    setTeams(teams.filter((_, idx) => idx !== i));
  }

  function updateTeam(i: number, field: keyof Team, value: string) {
    setTeams(teams.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));
  }

  function next() {
    if (step === 0 && bankIds.length === 0) { setError("Selecciona al menos un banco"); return; }
    if (step === 1 && mode === "teams" && step + 1 === 2) { setError(null); setStep(step + 1); return; }
    setError(null);
    const actualSteps = mode === "individual" ? ["banco", "modo", "tiempo"] : ["banco", "modo", "equipos", "tiempo"];
    if (step < actualSteps.length - 1) setStep(step + 1);
  }

  function back() { if (step > 0) setStep(step - 1); }

  async function handleCreate() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/game-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionBankIds: bankIds, mode, teams: mode === "teams" ? teams : undefined, timePerQuestion: time }),
    });

    const json = (await res.json()) as { data: { id: string } | null; error: string | null };
    setLoading(false);

    if (json.error || !json.data) { setError(json.error ?? "Error al crear la partida"); return; }
    router.push(`/games/${json.data.id}/lobby`);
  }

  const isLastStep = mode === "individual" ? step === 2 : step === 3;
  const currentSteps = mode === "individual" ? ["Banco", "Modo", "Tiempo"] : STEPS;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {currentSteps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
              i < step ? "bg-[#7C3AED] border-[#7C3AED] text-white"
              : i === step ? "border-[#7C3AED] text-[#7C3AED]"
              : "border-[#2D2A3E] text-[#9CA3AF]"
            )}>
              {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={cn("text-sm font-medium", i === step ? "text-[#F8FAFC]" : "text-[#9CA3AF]")}>{s}</span>
            {i < currentSteps.length - 1 && <ChevronRight className="h-4 w-4 text-[#2D2A3E]" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-xl border border-[#2D2A3E] bg-[#1E1B2E] p-6 min-h-[280px]">
        {error && <div className="mb-4 rounded-md bg-[#EF4444]/10 border border-[#EF4444]/20 p-3 text-sm text-[#EF4444]">{error}</div>}

        {/* Step 0: Banks (multi-select) */}
        {step === 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#9CA3AF]">Selecciona uno o varios bancos de preguntas.</p>
              {bankIds.length > 0 && (
                <span className="text-xs text-[#7C3AED] font-medium">
                  {totalQuestions} preguntas en total
                </span>
              )}
            </div>
            {banks.length === 0 && <p className="text-[#9CA3AF] text-sm">No hay bancos disponibles.</p>}
            {banks.map((b) => {
              const selected = bankIds.includes(b.id);
              return (
                <button key={b.id} onClick={() => toggleBank(b.id)}
                  className={cn("w-full text-left rounded-lg border p-4 transition-colors",
                    selected ? "border-[#7C3AED] bg-[#7C3AED]/10" : "border-[#2D2A3E] hover:border-[#7C3AED]/50 hover:bg-[#2D2A3E]/50"
                  )}>
                  <div className="flex items-center gap-3">
                    <div className={cn("h-5 w-5 rounded flex items-center justify-center border-2 shrink-0 transition-colors",
                      selected ? "bg-[#7C3AED] border-[#7C3AED]" : "border-[#4B5563]"
                    )}>
                      {selected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-medium text-[#F8FAFC]">{b.name}</span>
                      <span className="text-sm text-[#9CA3AF]">{b.questionCount} preguntas</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 1: Mode */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            {(["individual", "teams"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={cn("rounded-xl border-2 p-6 text-center transition-colors",
                  mode === m ? "border-[#7C3AED] bg-[#7C3AED]/10" : "border-[#2D2A3E] hover:border-[#7C3AED]/50"
                )}>
                <div className="text-3xl mb-3">{m === "individual" ? "👤" : "👥"}</div>
                <p className="font-semibold text-[#F8FAFC] capitalize">{m === "individual" ? "Individual" : "Por equipos"}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">{m === "individual" ? "Cada jugador compite por su cuenta" : "Los jugadores se agrupan en equipos"}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 2 (teams mode): Teams */}
        {step === 2 && mode === "teams" && (
          <div className="space-y-3">
            <p className="text-sm text-[#9CA3AF] mb-4">Configura los equipos (mín. 2, máx. 8).</p>
            {teams.map((team, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex gap-1.5 shrink-0">
                  {TEAM_COLORS.map((c) => (
                    <button key={c} onClick={() => updateTeam(i, "color", c)}
                      style={{ backgroundColor: c }}
                      className={cn("h-5 w-5 rounded-full transition-transform", team.color === c ? "scale-125 ring-2 ring-white ring-offset-1 ring-offset-[#1E1B2E]" : "opacity-60 hover:opacity-100")}
                    />
                  ))}
                </div>
                <Input value={team.name} onChange={(e) => updateTeam(i, "name", e.target.value)}
                  placeholder={`Equipo ${i + 1}`}
                  className="bg-[#13111A] border-[#2D2A3E] text-[#F8FAFC] placeholder:text-[#9CA3AF]" />
                <button onClick={() => removeTeam(i)} disabled={teams.length <= 2}
                  className="text-[#9CA3AF] hover:text-[#EF4444] disabled:opacity-30 transition-colors shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {teams.length < 8 && (
              <button onClick={addTeam} className="flex items-center gap-2 text-sm text-[#7C3AED] hover:text-[#5B21B6] transition-colors mt-2">
                <Plus className="h-4 w-4" /> Agregar equipo
              </button>
            )}
          </div>
        )}

        {/* Last step: Time */}
        {isLastStep && (
          <div className="space-y-4">
            <p className="text-sm text-[#9CA3AF] mb-4">¿Cuánto tiempo tendrán los jugadores para responder?</p>
            <div className="grid grid-cols-3 gap-4">
              {([10, 20, 30] as const).map((t) => (
                <button key={t} onClick={() => setTime(t)}
                  className={cn("rounded-xl border-2 p-6 text-center transition-colors",
                    time === t ? "border-[#7C3AED] bg-[#7C3AED]/10" : "border-[#2D2A3E] hover:border-[#7C3AED]/50"
                  )}>
                  <p className="text-3xl font-bold font-heading text-[#F8FAFC]">{t}s</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">{t === 10 ? "Rápido" : t === 20 ? "Normal" : "Relajado"}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={back} disabled={loading}
            className="border-[#2D2A3E] text-[#F8FAFC] hover:bg-[#2D2A3E]">
            Atrás
          </Button>
        )}
        <div className="flex-1" />
        {isLastStep ? (
          <Button onClick={handleCreate} disabled={loading}
            className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white px-8">
            {loading ? "Creando..." : "Crear partida →"}
          </Button>
        ) : (
          <Button onClick={next} className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white">
            Siguiente <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
