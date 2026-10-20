"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardCheck, Dumbbell, LineChart, Utensils } from "lucide-react";

import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/hoy", label: "Hoy", icon: Dumbbell },
  { href: "/menu", label: "Menú", icon: Utensils },
  { href: "/checkin", label: "Registro", icon: ClipboardCheck },
  { href: "/progreso", label: "Progreso", icon: LineChart },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-10 border-t bg-background pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
