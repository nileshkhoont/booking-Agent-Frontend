"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorBanner } from "@/components/common/error-banner";
import { CallStatusBadge } from "@/components/calls/call-status-badge";
import { AppointmentFormDialog } from "@/components/appointments/appointment-form-dialog";
import { usePerson } from "@/features/persons/hooks";
import { useAppointmentsForPerson } from "@/features/appointments/hooks";
import { useCalls } from "@/features/calls/hooks";
import { APPOINTMENT_STATUS_LABELS, CALL_TYPE_LABELS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";

export default function PersonDetailPage() {
  const params = useParams<{ personId: string }>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: person, isLoading, isError } = usePerson(params.personId);
  const { data: appointments } = useAppointmentsForPerson(params.personId);
  const { data: calls } = useCalls({ person_id: params.personId, page: 1, page_size: 10 });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !person) return <ErrorBanner message="Failed to load person" />;

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{person.full_name || person.phone_number}</h1>
          {person.full_name && <p className="text-sm text-muted-foreground">{person.phone_number}</p>}
        </div>
        <Button onClick={() => setDialogOpen(true)}>Book appointment</Button>
      </div>

      <Card className="mb-6">
        <CardContent className="grid grid-cols-2 gap-2 pt-6 text-sm">
          <span className="text-muted-foreground">Email</span>
          <span>{person.email ?? "—"}</span>
          <span className="text-muted-foreground">Alternate phone</span>
          <span>{person.alternate_phone ?? "—"}</span>
          <span className="text-muted-foreground">Preferred language</span>
          <span>{person.preferred_language ?? "—"}</span>
          <span className="text-muted-foreground">Notes</span>
          <span>{person.notes ?? "—"}</span>
        </CardContent>
      </Card>

      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Appointments</h2>
      <div className="mb-6 flex flex-col gap-2">
        {appointments && appointments.length === 0 && (
          <p className="text-sm text-muted-foreground">No appointments yet.</p>
        )}
        {appointments?.map((appointment) => (
          <Link
            key={appointment.id}
            href={`/appointments/${appointment.id}`}
            className="flex items-center justify-between rounded-md border border-border p-3 text-sm hover:bg-muted"
          >
            <span>{formatDateTime(appointment.appointment_datetime)}</span>
            <Badge tone={appointment.status === "cancelled" ? "destructive" : "success"}>
              {APPOINTMENT_STATUS_LABELS[appointment.status]}
            </Badge>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Recent calls</h2>
      <div className="flex flex-col gap-2">
        {calls && calls.items.length === 0 && <p className="text-sm text-muted-foreground">No calls yet.</p>}
        {calls?.items.map((call) => (
          <Link
            key={call.id}
            href={`/calls/${call.id}`}
            className="flex items-center justify-between rounded-md border border-border p-3 text-sm hover:bg-muted"
          >
            <span>
              {formatDateTime(call.start_time ?? call.created_at)} — {CALL_TYPE_LABELS[call.call_type]}
            </span>
            <CallStatusBadge status={call.call_status} />
          </Link>
        ))}
      </div>

      <AppointmentFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} personId={person.id} />
    </div>
  );
}
