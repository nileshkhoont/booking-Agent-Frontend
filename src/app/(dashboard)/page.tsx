"use client";

import {
  CalendarCheck,
  CalendarX,
  PhoneIncoming,
  PhoneOutgoing,
  UserCog,
  Bot,
  PhoneMissed,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorBanner } from "@/components/common/error-banner";
import { useDashboardStats } from "@/features/dashboard/hooks";
import { cn } from "@/lib/utils";

export default function OverviewPage() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorBanner message="Failed to load dashboard stats" />;

  const tiles: { label: string; value: number; icon: LucideIcon; tone: "accent" | "secondary" | "success" | "destructive" | "muted" }[] = [
    { label: "Booked Appointments", value: data.booked_appointments, icon: CalendarCheck, tone: "success" },
    { label: "Cancelled Appointments", value: data.cancelled_appointments, icon: CalendarX, tone: "destructive" },
    { label: "Inbound Calls", value: data.inbound_calls, icon: PhoneIncoming, tone: "accent" },
    { label: "Outbound Calls", value: data.outbound_calls, icon: PhoneOutgoing, tone: "accent" },
    { label: "Admin Scheduled Calls", value: data.admin_scheduled_calls, icon: UserCog, tone: "secondary" },
    { label: "Agent Scheduled Calls", value: data.agent_scheduled_calls, icon: Bot, tone: "secondary" },
    { label: "Failed Calls", value: data.failed_calls, icon: PhoneMissed, tone: "destructive" },
  ];

  const toneClasses: Record<(typeof tiles)[number]["tone"], string> = {
    accent: "bg-accent/10 text-accent",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success-bg text-success",
    destructive: "bg-destructive-bg text-destructive",
    muted: "bg-muted text-muted-foreground",
  };

  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        A live snapshot of calls and appointments handled by the assistant.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tiles.map((tile) => (
          <Card key={tile.label} className="hover:shadow-md">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{tile.label}</CardTitle>
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", toneClasses[tile.tone])}>
                <tile.icon size={16} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">{tile.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
