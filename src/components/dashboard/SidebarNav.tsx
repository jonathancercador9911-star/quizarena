"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/banks", label: "Mis Bancos", Icon: BookOpen, exact: false },
  { href: "/games", label: "Partidas", Icon: Gamepad2, exact: false },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {navItems.map(({ href, label, Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-[#7C3AED]/15 text-[#7C3AED]"
                : "text-[#9CA3AF] hover:bg-[#2D2A3E] hover:text-[#F8FAFC]"
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
