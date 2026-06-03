import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export function apiResponse<T>(
  data: T | null,
  error: string | null,
  status = 200
) {
  return NextResponse.json({ data, error }, { status });
}

export async function getModerator() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.moderator.findUnique({ where: { authId: user.id } });
}
