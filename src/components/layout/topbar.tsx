"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { pageTitleFor } from "@/config/site";

/** The mobile menu trigger + the page's ONE title — pages no longer repeat their own name again
 * as a page-level <h1> (see the per-page changes that removed it); this is the single place it's
 * shown now, so it's sized like a real heading rather than a small label.
 */
export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const title = pageTitleFor(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>
      {title && (
        <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">{title}</h1>
      )}
    </header>
  );
}
