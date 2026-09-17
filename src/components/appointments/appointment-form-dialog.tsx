"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ErrorBanner } from "@/components/common/error-banner";
import { SlotPicker } from "./slot-picker";
import { useCreateAppointment } from "@/features/appointments/hooks";
import { ApiError } from "@/lib/api-client";
import { istLocalInputToUtcIso } from "@/lib/utils";

export function AppointmentFormDialog({
  open,
  onClose,
  personId,
}: {
  open: boolean;
  onClose: () => void;
  personId: string;
}) {
  const [datetime, setDatetime] = useState("");
  const createAppointment = useCreateAppointment();

  function handleSubmit() {
    if (!datetime) return;
    createAppointment.mutate(
      {
        person_id: personId,
        appointment_datetime: istLocalInputToUtcIso(datetime),
        booking_source: "admin_scheduled_call",
      },
      {
        onSuccess: () => {
          setDatetime("");
          onClose();
        },
      },
    );
  }

  return (
    <Dialog open={open} onClose={onClose} title="Book appointment">
      <div className="flex flex-col gap-4">
        {createAppointment.isError && (
          <ErrorBanner
            message={
              createAppointment.error instanceof ApiError
                ? createAppointment.error.message
                : "Failed to book appointment"
            }
          />
        )}
        <div className="flex flex-col gap-1.5">
          <Label>Date &amp; time</Label>
          <SlotPicker value={datetime} onChange={setDatetime} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!datetime || createAppointment.isPending}>
            {createAppointment.isPending ? "Booking…" : "Book"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
