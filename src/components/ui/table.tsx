import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Table({
  className,
  fillHeight = false,
  bare = false,
  style,
  ...props
}: HTMLAttributes<HTMLTableElement> & {
  /** True on a page that wraps this in a `flex-1 min-h-0` column (see e.g. calls/page.tsx) —
   * the table then fills exactly the space left over after the filter bar and the pagination
   * footer, so pagination sits at a genuinely FIXED spot at the bottom of the screen and the
   * table's own rows can never render behind/underneath it (they're siblings in the same flex
   * column, not overlapping layers). False (default) keeps the old standalone behavior — capped
   * at a fixed viewport-relative height — for any table not wrapped that way.
   */
  fillHeight?: boolean;
  /** True when this table is already nested inside another bordered/card container (see
   * ListCard) — drops the wrapper's own border/rounded corners/background so the toolbar and
   * table read as one card instead of a card inside a card.
   */
  bare?: boolean;
}) {
  return (
    // min-w-full (not w-full) on the table itself is the load-bearing part for horizontal
    // scroll: it lets the table grow WIDER than its container when columns genuinely need the
    // room, so this wrapper actually scrolls horizontally on narrow screens — w-full previously
    // capped the table at the viewport width, which forced every cell's text to wrap word-by-word
    // instead. `overflow-auto` (both axes) gives the same container a vertical scrollbar for long
    // lists too, with TableHeader's `sticky top-0` keeping column headers pinned while only the
    // rows underneath scroll.
    <div
      className={cn(
        "w-full overflow-auto",
        bare ? "bg-card" : "rounded-lg border border-border bg-card",
        fillHeight ? "h-full" : "max-h-[60vh]",
      )}
    >
      <table className={cn("min-w-full caption-bottom text-sm", className)} style={style} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("sticky top-0 z-10 border-b border-border bg-card", className)}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("border-b border-border hover:bg-muted/50", className)} {...props} />;
}

export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "whitespace-nowrap px-3 py-3.5 text-left align-middle text-sm font-semibold text-foreground",
        className,
      )}
      {...props}
    />
  );
}

// whitespace-nowrap by default — a data table cell that wraps word-by-word on a narrow screen
// is harder to read than one the row just scrolls to reach; pass `className="whitespace-normal"`
// (or `truncate`, already used for the queue's Instructions column) on any cell that needs to
// wrap or clip instead.
export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("whitespace-nowrap p-3 align-middle", className)} {...props} />;
}
