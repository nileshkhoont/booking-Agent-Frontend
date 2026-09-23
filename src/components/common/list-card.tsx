import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The single bordered card a list page's toolbar + table + pagination all live inside, so they
 * read as one cohesive block instead of a toolbar floating in the page's own background above a
 * separately-bordered table (the two-tone "gap" that made Calls/Appointments/Schedule/Persons
 * look inconsistent — see the improvement that introduced this).
 */
export function ListCard({
  toolbar,
  toolbarClassName,
  children,
  className,
}: {
  toolbar?: ReactNode;
  toolbarClassName?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xs",
        className,
      )}
    >
      {toolbar && (
        <div
          className={cn(
            "flex shrink-0 flex-wrap items-center gap-3 border-b border-border px-4 py-3",
            toolbarClassName,
          )}
        >
          {toolbar}
        </div>
      )}
      {children}
    </div>
  );
}
