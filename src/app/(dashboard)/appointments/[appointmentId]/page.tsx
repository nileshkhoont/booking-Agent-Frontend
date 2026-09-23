"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorBanner } from "@/components/common/error-banner";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { SlotPicker } from "@/components/appointments/slot-picker";
import { useAppointment, useCancelAppointment, useRescheduleAppointment } from "@/features/appointments/hooks";
import { usePerson } from "@/features/persons/hooks";
import { APPOINTMENT_STATUS_LABELS } from "@/lib/constants";
import { formatDateTime, istLocalInputToUtcIso } from "@/lib/utils";

export default function AppointmentDetailPage() {
  const params = useParams<{ appointmentId: string }>();
  const router = useRouter();
  const { data: appointment, isLoading, isError } = useAppointment(params.appointmentId);
  const { data: person } = usePerson(appointment?.person_id);

  const [rescheduling, setRescheduling] = useState(false);
  const [newDatetime, setNewDatetime] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);

  const reschedule = useRescheduleAppointment();
  const cancel = useCancelAppointment();

  if (isLoading) return <LoadingSpinner />;
  if (isError || !appointment) return <ErrorBanner message="Failed to load appointment" />;

  const canModify = appointment.status === "booked" || appointment.status === "rescheduled";

  return (
    <div className="max-w-2xl">
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-lg font-medium">{formatDateTime(appointment.appointment_datetime)}</p>
            <Badge tone={appointment.status === "cancelled" ? "destructive" : "success"}>
              {APPOINTMENT_STATUS_LABELS[appointment.status]}
            </Badge>
          </div>

          {person && (
            <p className="text-sm text-muted-foreground">
              For{" "}
              <a href={`/persons/${person.id}`} className="text-foreground hover:underline">
                {person.full_name || person.phone_number}
              </a>
              {person.full_name && ` (${person.phone_number})`}
            </p>
          )}

          {appointment.notes && <p className="text-sm">{appointment.notes}</p>}

          {appointment.original_appointment_id && (
            <p className="text-xs text-muted-foreground">
              Rescheduled from{" "}
              <a href={`/appointments/${appointment.original_appointment_id}`} className="underline">
                a previous appointment
              </a>
              .
            </p>
          )}

          {canModify && (
            <div className="flex flex-col gap-3 border-t border-border pt-4">
              {!rescheduling ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setRescheduling(true)}>
                    Reschedule
                  </Button>
                  <Button variant="destructive" onClick={() => setCancelOpen(true)}>
                    Cancel appointment
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <SlotPicker value={newDatetime} onChange={setNewDatetime} excludeAppointmentId={appointment.id} />
                  {reschedule.isError && <ErrorBanner message="Failed to reschedule" />}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setRescheduling(false)}>
                      Cancel
                    </Button>
                    <Button
                      disabled={!newDatetime || reschedule.isPending}
                      onClick={() =>
                        reschedule.mutate(
                          { id: appointment.id, newDatetime: istLocalInputToUtcIso(newDatetime) },
                          {
                            onSuccess: (updated) => {
                              setRescheduling(false);
                              router.push(`/appointments/${updated.id}`);
                            },
                          },
                        )
                      }
                    >
                      {reschedule.isPending ? "Rescheduling…" : "Confirm new time"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={cancelOpen}
        title="Cancel this appointment?"
        description="This cannot be undone from here."
        confirmLabel="Cancel appointment"
        destructive
        onClose={() => setCancelOpen(false)}
        onConfirm={() => cancel.mutate({ id: appointment.id })}
      />
    </div>
  );
}
