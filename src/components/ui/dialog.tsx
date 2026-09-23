"use client";

import { ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  /** Set false for dialogs holding meaningful unsaved input (forms) where an accidental
   * backdrop click losing data would be worse than the convenience — e.g. PersonFormDialog,
   * AppointmentFormDialog. Defaults to true, which is correct for read-only viewers
   * (CallDetailModal) and confirm/cancel prompts (ConfirmDialog).
   */
  closeOnBackdropClick?: boolean;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
  closeOnBackdropClick = true,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // A lightweight focus trap — Tab/Shift+Tab cycle within the dialog instead of escaping
      // into the (visually hidden, but still tab-reachable) page behind it.
      if (e.key === "Tab" && panelRef.current) {
        const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);

    // Lock background scroll while the dialog is open — restores whatever was there before,
    // rather than assuming it was always "auto".
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the dialog on open (to its first focusable control, falling back to the
    // panel itself), and return it to whatever triggered the dialog on close — standard modal
    // behavior so keyboard/screen-reader users land somewhere sensible either way.
    const triggerElement = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusable ?? panelRef.current)?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(raf);
      triggerElement?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dialog-title" : undefined}
        tabIndex={-1}
        className={cn(
          "animate-dialog-in max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-lg",
          "border border-border bg-card p-5 shadow-lg outline-none sm:p-6",
          className,
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          {title && (
            <h2 id="dialog-title" className="text-lg font-semibold">
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
