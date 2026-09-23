"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useCurrentAdmin } from "@/features/auth/hooks";
import { clearTokens } from "@/lib/auth";
import { cn } from "@/lib/utils";

/** Admin identity + logout, pinned at the bottom of the nav — the single place this lives now
 * (desktop Sidebar and the MobileNav drawer both render it, so logout stays reachable from
 * everywhere it always was; Topbar no longer duplicates it).
 */
export function SidebarFooter({ collapsed = false }: { collapsed?: boolean }) {
  const router = useRouter();
  const { data: admin } = useCurrentAdmin();

  function handleLogout() {
    clearTokens();
    router.push("/login");
  }

  const initial = admin?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div className="border-t border-border p-2">
      <div className={cn("flex items-center gap-2 rounded-md p-2", collapsed && "justify-center")}>
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
          aria-hidden="true"
        >
          {initial}
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-tight">{admin?.name ?? "…"}</p>
            <p className="truncate text-xs leading-tight text-muted-foreground">{admin?.email ?? ""}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          title="Log out"
          aria-label="Log out"
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive",
            collapsed && "hidden",
          )}
        >
          <LogOut size={16} />
        </button>
      </div>
      {collapsed && (
        <button
          type="button"
          onClick={handleLogout}
          title="Log out"
          aria-label="Log out"
          className="mt-1 flex h-8 w-full items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
        >
          <LogOut size={16} />
        </button>
      )}
    </div>
  );
}
