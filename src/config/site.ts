import {
  LayoutDashboard,
  Phone,
  CalendarCheck,
  CalendarClock,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export const siteConfig = {
  name: "AI Calling Agent",
  description: "Admin dashboard for the AI Calling Agent — calls, appointments, and scheduling.",
  nav: [
    { title: "Overview", href: "/", icon: LayoutDashboard },
    { title: "Calls", href: "/calls", icon: Phone },
    { title: "Appointments", href: "/appointments", icon: CalendarCheck },
    { title: "Schedule", href: "/schedule", icon: CalendarClock },
    { title: "Persons", href: "/persons", icon: Users },
    { title: "Settings", href: "/settings/business-config", icon: Settings },
  ] satisfies { title: string; href: string; icon: LucideIcon }[],
};

/** The single, large page title shown in Topbar — the ONLY place a page's own name is now
 * rendered (list/settings pages no longer repeat it again as an <h1>; see per-page changes).
 * More granular than `nav` on purpose: every settings sub-page needs its own distinct title
 * (previously there was no Topbar match for /settings/admins or /settings/voice-agent at all,
 * since siteConfig.nav only lists the group's first page — that left the Topbar blank on those
 * two routes). Sorted longest-href-first by pageTitleFor() below so the most specific match wins
 * (e.g. "/settings/admins" over the plain "/settings/business-config" entry never even applies).
 */
export const pageTitles = [
  { href: "/", title: "Overview" },
  { href: "/calls", title: "Calls" },
  { href: "/appointments", title: "Appointments" },
  { href: "/schedule", title: "Schedule" },
  { href: "/schedule/new", title: "Schedule a Call" },
  { href: "/persons", title: "Persons" },
  { href: "/settings/business-config", title: "Business Hours" },
  { href: "/settings/admins", title: "Admins" },
  { href: "/settings/voice-agent", title: "Voice Agent" },
];

export function pageTitleFor(pathname: string): string | undefined {
  const match = [...pageTitles]
    .sort((a, b) => b.href.length - a.href.length)
    .find((entry) => (entry.href === "/" ? pathname === "/" : pathname.startsWith(entry.href)));
  return match?.title;
}
