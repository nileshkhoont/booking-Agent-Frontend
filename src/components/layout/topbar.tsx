"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentAdmin } from "@/features/auth/hooks";
import { clearTokens } from "@/lib/auth";

export function Topbar() {
  const router = useRouter();
  const { data: admin } = useCurrentAdmin();

  function handleLogout() {
    clearTokens();
    router.push("/login");
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div />
      <div className="flex items-center gap-3">
        {admin && (
          <span className="text-sm text-muted-foreground">
            {admin.name} <span className="text-xs">({admin.role})</span>
          </span>
        )}
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut size={16} /> Log out
        </Button>
      </div>
    </header>
  );
}
