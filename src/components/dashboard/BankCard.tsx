"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Trash2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BankCardProps {
  id: string;
  name: string;
  description: string | null;
  questionCount: number;
  isSystem: boolean;
}

export function BankCard({
  id,
  name,
  description,
  questionCount,
  isSystem,
}: BankCardProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`¿Eliminar el banco "${name}"? Esta acción no se puede deshacer.`)) return;

    const res = await fetch(`/api/question-banks/${id}`, { method: "DELETE" });
    const json = (await res.json()) as { error: string | null };
    if (json.error) {
      alert(json.error);
      return;
    }
    router.refresh();
  }

  return (
    <Card className="bg-[#1E1B2E] border-[#2D2A3E] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-[#F8FAFC] text-base font-semibold leading-snug">
            {name}
          </CardTitle>
          {isSystem ? (
            <Badge className="shrink-0 bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30">
              Sistema
            </Badge>
          ) : (
            <Badge className="shrink-0 bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30">
              Propio
            </Badge>
          )}
        </div>
        {description && (
          <CardDescription className="text-[#9CA3AF] text-sm line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="py-2">
        <div className="flex items-center gap-1.5 text-sm text-[#9CA3AF]">
          <BookOpen className="h-3.5 w-3.5" />
          <span>{questionCount} preguntas</span>
        </div>
      </CardContent>

      <CardFooter className="pt-3 flex gap-2 mt-auto">
        <Link href={`/banks/${id}`} className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-[#2D2A3E] text-[#F8FAFC] hover:bg-[#2D2A3E]"
          >
            Ver banco
          </Button>
        </Link>
        {isSystem ? (
          <Button
            size="sm"
            variant="ghost"
            disabled
            className="text-[#9CA3AF] cursor-not-allowed"
            title="Los bancos del sistema son de solo lectura"
          >
            <Lock className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
