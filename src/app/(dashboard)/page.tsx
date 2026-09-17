"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorBanner } from "@/components/common/error-banner";
import { useDashboardStats } from "@/features/dashboard/hooks";

export default function OverviewPage() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorBanner message="Failed to load dashboard stats" />;

  const tiles = [
    { label: "Booked Appointments", value: data.booked_appointments },
    { label: "Cancelled Appointments", value: data.cancelled_appointments },
    { label: "Inbound Calls", value: data.inbound_calls },
    { label: "Outbound Calls", value: data.outbound_calls },
    { label: "Admin Scheduled Calls", value: data.admin_scheduled_calls },
    { label: "Agent Scheduled Calls", value: data.agent_scheduled_calls },
    { label: "Failed Calls", value: data.failed_calls },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Overview</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Card key={tile.label}>
            <CardHeader>
              <CardTitle>{tile.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{tile.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
