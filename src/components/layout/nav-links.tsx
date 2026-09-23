"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** The nav item list itself — shared by the persistent desktop sidebar and the mobile drawer so
 * the two can never drift out of sync. `onNavigate` lets the mobile drawer close itself on tap.
 * `collapsed` renders icon-only, centered, with the label visually hidden but still present for
 * screen readers — used by the desktop sidebar's collapsed state only (mobile drawer never
 * collapses, so it never passes this).
 */
export function NavLinks({
  onNavigate,
  collapsed = false,
  className,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {siteConfig.nav.map((item) => {
        // Compare the first path segment, not the whole href — "Settings" (href
        // "/settings/business-config") must stay highlighted on every settings sub-page
        // (/settings/admins, /settings/voice-agent too), not just its own default landing page.
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.split("/")[1] === item.href.split("/")[1];
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.title : undefined}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-md py-2 text-sm font-medium text-muted-foreground transition-colors",
              collapsed ? "justify-center px-2" : "px-3",
              "hover:bg-muted hover:text-foreground",
              active && "bg-accent/10 text-accent hover:bg-accent/10 hover:text-accent",
            )}
          >
            {/* Active indicator — a left accent bar, the reference pattern this mirrors. Kept as
                its own absolutely-positioned element so it doesn't disturb icon/label spacing. */}
            <span
              className={cn(
                "absolute inset-y-1 left-0 w-0.5 rounded-full bg-accent transition-opacity",
                active ? "opacity-100" : "opacity-0",
              )}
              aria-hidden="true"
            />
            <Icon size={18} className="shrink-0" />
            <span className={cn(collapsed && "sr-only")}>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
