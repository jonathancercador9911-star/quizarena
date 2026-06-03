"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type CodeStatus = "idle" | "checking" | "valid" | "invalid";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [codeStatus, setCodeStatus] = useState<CodeStatus>("idle");
  const [codeError, setCodeError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (code.length < 6) {
      setCodeStatus("idle");
      setCodeError("");
      return;
    }

    setCodeStatus("checking");
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/join/${code}`);
        const json = (await res.json()) as { error: string | null };
        if (json.error) {
          setCodeStatus("invalid");
          setCodeError(json.error);
        } else {
          setCodeStatus("valid");
          setCodeError("");
        }
      } catch {
        setCodeStatus("invalid");
        setCodeError("Error de conexión");
      }
    }, 500);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [code]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (codeStatus !== "valid") return;
    setLoading(true);
    setSubmitError("");

    const res = await fetch(`/api/join/${code}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    });

    const json = (await res.json()) as {
      data: { playerId: string; gameSessionId: string; mode: string } | null;
      error: string | null;
    };

    setLoading(false);

    if (json.error || !json.data) {
      setSubmitError(json.error ?? "Error al unirse");
      return;
    }

    sessionStorage.setItem("quiz_player_id", json.data.playerId);
    sessionStorage.setItem("quiz_player_nickname", nickname);
    sessionStorage.setItem("quiz_session_id", json.data.gameSessionId);
    sessionStorage.setItem("quiz_session_mode", json.data.mode);
    router.push(`/play/${code}/lobby`);
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-extrabold text-[#F8FAFC]">
            QuizArena
          </h1>
          <p className="text-[#9CA3AF] mt-2">Ingresá el código de sala para unirte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Code input */}
          <div className="space-y-2">
            <Label className="text-[#F8FAFC] text-sm">Código de sala</Label>
            <div className="relative">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
                placeholder="XXXXXX"
                maxLength={6}
                className={cn(
                  "font-mono text-center text-2xl tracking-[0.4em] h-14 bg-[#1E1B2E] border-2 text-[#F8FAFC] placeholder:text-[#2D2A3E] placeholder:tracking-[0.4em] transition-colors",
                  codeStatus === "valid" && "border-[#10B981]",
                  codeStatus === "invalid" && "border-[#EF4444]",
                  codeStatus === "checking" && "border-[#7C3AED]",
                  codeStatus === "idle" && "border-[#2D2A3E]"
                )}
                required
              />
              {codeStatus === "checking" && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {codeStatus === "valid" && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#10B981] text-xs font-medium">✓</div>
              )}
            </div>
            {codeStatus === "invalid" && (
              <p className="text-xs text-[#EF4444]">{codeError}</p>
            )}
            {codeStatus === "valid" && (
              <p className="text-xs text-[#10B981]">Sala encontrada</p>
            )}
          </div>

          {/* Nickname input */}
          <div className="space-y-2">
            <Label className="text-[#F8FAFC] text-sm">Tu nombre</Label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value.slice(0, 20))}
              placeholder="Cómo te llaman"
              minLength={2}
              maxLength={20}
              required
              className="h-12 bg-[#1E1B2E] border-[#2D2A3E] text-[#F8FAFC] placeholder:text-[#9CA3AF] text-base"
            />
          </div>

          {submitError && (
            <p className="text-sm text-[#EF4444] text-center">{submitError}</p>
          )}

          <Button
            type="submit"
            disabled={codeStatus !== "valid" || nickname.trim().length < 2 || loading}
            className="w-full h-12 bg-[#7C3AED] hover:bg-[#5B21B6] text-white text-base font-semibold disabled:opacity-50"
          >
            {loading ? "Uniéndose..." : "Unirse a la partida"}
          </Button>
        </form>
      </div>
    </div>
  );
}
