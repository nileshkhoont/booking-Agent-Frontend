import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Numbered page list with ellipsis for gaps — always shows the first and last page, and a
 * window of pages around the current one, e.g. [1, "…", 4, 5, 6, "…", 12].
 */
function buildPageList(current: number, totalPages: number): (number | "…")[] {
  const pages = new Set<number>([1, totalPages, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const withEllipsis: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0) {
      const prev = sorted[i - 1];
      if (prev !== undefined && p - prev > 1) withEllipsis.push("…");
    }
    withEllipsis.push(p);
  });
  return withEllipsis;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);
  const pageList = buildPageList(page, totalPages);

  return (
    // A plain shrink-0 flex child, not sticky/fixed positioning — on pages that wrap Table
    // (with fillHeight) and this Pagination in a `flex h-full flex-col` column, the flex layout
    // itself guarantees this sits at a fixed spot at the bottom: Table is `flex-1 min-h-0` and
    // absorbs all the remaining space, so this footer never moves and the table's rows can never
    // render behind it — they're separate boxes in the same column, not overlapping layers.
    <div className="flex shrink-0 flex-col items-center justify-between gap-3 border-t border-border bg-card px-4 py-3 sm:flex-row sm:px-6">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{rangeStart}</span> to{" "}
        <span className="font-medium text-foreground">{rangeEnd}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span> records
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-input bg-background px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {pageList.map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="px-1.5 text-sm text-muted-foreground">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                aria-current={p === page ? "page" : undefined}
                onClick={() => onPageChange(p)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors",
                  p === page
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {p}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-input bg-background px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
