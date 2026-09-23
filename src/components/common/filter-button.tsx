"use client";

import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

/** Trigger button for FilterDialog — an icon + label with a count badge when filters are
 * active, meant to sit top-right of a list page in place of an always-visible filter row.
 */
export function FilterButton({
  activeCount,
  onClick,
  className,
}: {
  activeCount: number;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-9 shrink-0 items-center gap-2 rounded-md border border-accent/20 bg-accent/10 px-3 text-sm font-medium text-accent shadow-xs transition-colors",
        "hover:bg-accent/15 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25",
        className,
      )}
    >
      <SlidersHorizontal size={15} />
      Filters
      {activeCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-foreground">
          {activeCount}
        </span>
      )}
    </button>
  );
}
