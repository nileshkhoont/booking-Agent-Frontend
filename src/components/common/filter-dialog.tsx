"use client";

import { ReactNode } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/** Shared filter-dialog shell used by every list page (Calls, Appointments, Schedule) — only
 * the fields in `children` differ per page. Draft values live in the caller's own state and are
 * only committed (via onApply) when the admin confirms, so opening the dialog and closing it
 * without applying leaves the active filters untouched.
 */
export function FilterDialog({
  open,
  onClose,
  onApply,
  onClear,
  title = "Filters",
  children,
}: {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  title?: string;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={onClear}>
          Clear all
        </Button>
        <Button type="button" onClick={onApply}>
          Apply filters
        </Button>
      </div>
    </Dialog>
  );
}
