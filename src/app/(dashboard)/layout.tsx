import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { UserMenu } from "@/components/dashboard/UserMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const moderator = await prisma.moderator.findUnique({
    where: { authId: user.id },
    select: { name: true, email: true },
  });

  const displayName = moderator?.name ?? user.email ?? "Moderador";
  const displayEmail = moderator?.email ?? user.email ?? "";

  return (
    <div className="flex h-screen bg-[#13111A] overflow-hidden">
      <aside className="w-60 flex-shrink-0 border-r border-[#2D2A3E] bg-[#1E1B2E] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#2D2A3E]">
          <span className="font-heading font-bold text-lg text-[#F8FAFC] tracking-tight">
            QuizArena
          </span>
        </div>

        <SidebarNav />

        <div className="border-t border-[#2D2A3E] p-4">
          <UserMenu name={displayName} email={displayEmail} />
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
