import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "secondary" | "success" | "warning" | "destructive" | "muted" | "accent";

// Every tone reads from the same semantic CSS-var tokens the rest of the app uses (see
// globals.css) instead of hardcoded Tailwind color utilities, so the palette stays a single
// source of truth and would respect a future dark theme automatically.
const toneClasses: Record<Tone, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  destructive: "bg-destructive-bg text-destructive",
  muted: "bg-muted text-muted-foreground",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
