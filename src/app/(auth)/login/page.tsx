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

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return <LoginForm searchParams={searchParams} />;
}

function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  void searchParams; // error param handled via redirect URL; unused in client state

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md bg-[#1E1B2E] border-[#2D2A3E]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-[#F8FAFC]">
          Iniciar sesión
        </CardTitle>
        <CardDescription className="text-[#9CA3AF]">
          Accedé a tu panel de moderador
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
          <p className="text-sm text-[#9CA3AF] text-center">
            ¿No tenés cuenta?{" "}
            <Link
              href="/register"
              className="text-[#7C3AED] hover:underline font-medium"
            >
              Registrate
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
