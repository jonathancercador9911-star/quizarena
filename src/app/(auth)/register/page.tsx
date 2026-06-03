"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <Card className="w-full max-w-md bg-[#1E1B2E] border-[#2D2A3E]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[#10B981]">
            ¡Cuenta creada!
          </CardTitle>
          <CardDescription className="text-[#9CA3AF]">
            Revisa tu email para confirmar tu cuenta. Una vez confirmada, puedes
            iniciar sesión.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            onClick={() => router.push("/login")}
            className="w-full bg-[#7C3AED] hover:bg-[#5B21B6] text-white"
          >
            Ir al login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-[#1E1B2E] border-[#2D2A3E]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-[#F8FAFC]">
          Crear cuenta
        </CardTitle>
        <CardDescription className="text-[#9CA3AF]">
          Regístrate como Maestro de Arena para abrir combates
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-[#EF4444]/10 border border-[#EF4444]/20 p-3 text-sm text-[#EF4444]">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#F8FAFC]">
              Nombre
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="bg-[#13111A] border-[#2D2A3E] text-[#F8FAFC] placeholder:text-[#9CA3AF]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#F8FAFC]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="bg-[#13111A] border-[#2D2A3E] text-[#F8FAFC] placeholder:text-[#9CA3AF]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#F8FAFC]">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              className="bg-[#13111A] border-[#2D2A3E] text-[#F8FAFC] placeholder:text-[#9CA3AF]"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full bg-[#7C3AED] hover:bg-[#5B21B6] text-white"
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
          <p className="text-sm text-[#9CA3AF] text-center">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-[#7C3AED] hover:underline font-medium"
            >
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
