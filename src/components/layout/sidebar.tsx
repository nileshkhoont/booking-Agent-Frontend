"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, PhoneCall } from "lucide-react";
import { siteConfig } from "@/config/site";
import { NavLinks } from "@/components/layout/nav-links";
import { SidebarFooter } from "@/components/layout/sidebar-footer";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "sidebar-collapsed";

/** Persistent desktop sidebar (md and up), with a collapsible icon-only mode. Below md, MobileNav
 * (a slide-in drawer) takes over — see dashboard-shell.tsx.
 */
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // Restore the collapsed preference after mount (not during SSR/first paint) — avoids a
  // hydration mismatch, at the cost of one harmless frame at the expanded width on reload.
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // Private browsing / storage disabled — collapse preference just won't persist.
    }
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // Non-fatal — collapse still works for this session, it just won't be remembered.
      }
      return next;
    });
  }

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200 md:flex",
        collapsed ? "w-[4.5rem]" : "w-64",
      )}
    >
      <div className={cn("flex h-14 items-center border-b border-border", collapsed ? "justify-center px-2" : "gap-2 px-3")}>
        {!collapsed && (
          <>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent/70 text-accent-foreground shadow-sm">
              <PhoneCall size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight tracking-tight">{siteConfig.name}</p>
              <p className="truncate text-xs leading-tight text-muted-foreground">Admin Portal</p>
            </div>
          </>
        )}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={collapsed}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft size={16} className={cn("transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <NavLinks collapsed={collapsed} />
      </div>

      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}
