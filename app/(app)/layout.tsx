import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";

import { signOut } from "./actions";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <header className="flex items-center justify-between px-4 py-3">
        <span className="text-lg font-semibold">Coach</span>
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="sm">
            Salir
          </Button>
        </form>
      </header>
      <main className="flex-1 px-4 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
