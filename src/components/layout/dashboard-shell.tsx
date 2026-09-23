"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  // Belt-and-braces: close the drawer on any route change, even if a link click somehow
  // doesn't fire onNavigate (e.g. browser back/forward).
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    // h-dvh (not min-h-screen) + overflow-hidden: the app shell itself is pinned to exactly the
    // visible viewport — dvh (dynamic viewport height), not vh, so this is correct on mobile
    // browsers whose address bar shows/hides and changes the visible area. Only `main` below
    // scrolls; that's what makes a `sticky bottom-0` Pagination (see components/common/
    // pagination.tsx) actually stick to the bottom of the visible screen instead of to the
    // bottom of an ever-growing page — previously the whole page/body scrolled, so on a short
    // window you had to scroll past the table before pagination came into view at all.
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
