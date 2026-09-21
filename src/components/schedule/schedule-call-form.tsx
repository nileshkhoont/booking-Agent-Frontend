"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/common/error-banner";
import { usePersons } from "@/features/persons/hooks";
import { useBookableAppointments } from "@/features/appointments/hooks";
import { useCreateCallSchedule } from "@/features/schedule/hooks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatDateTime, istLocalInputToUtcIso } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";

export function ScheduleCallForm() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [personId, setPersonId] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [instructions, setInstructions] = useState("");

  const { data: personResults } = usePersons({ q: debouncedSearch || undefined, page: 1, page_size: 10 });
  const { data: bookableAppointments } = useBookableAppointments(personId || undefined);
  const createSchedule = useCreateCallSchedule();

  function handleSubmit() {
    if (!personId || !scheduledAt) return;
    createSchedule.mutate(
      {
        person_id: personId,
        appointment_id: appointmentId || undefined,
        scheduled_at: istLocalInputToUtcIso(scheduledAt),
        admin_instructions: instructions || undefined,
      },
      { onSuccess: () => router.push("/schedule") },
    );
  }

  return (
    <Card className="max-w-xl">
      <CardContent className="flex flex-col gap-4 pt-6">
        {createSchedule.isError && (
          <ErrorBanner
            message={createSchedule.error instanceof ApiError ? createSchedule.error.message : "Failed to schedule call"}
          />
        )}

        <div className="flex flex-col gap-1.5">
          <Label>Person</Label>
          <Input
            placeholder="Search by name or phone number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {personResults && personResults.items.length > 0 && (
            <Select value={personId} onChange={(e) => { setPersonId(e.target.value); setAppointmentId(""); }}>
              <option value="">Select a person…</option>
              {personResults.items.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.full_name ? `${person.full_name} (${person.phone_number})` : person.phone_number}
                </option>
              ))}
            </Select>
          )}
        </div>

        {personId && bookableAppointments && bookableAppointments.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <Label>Link to an existing booked appointment (optional)</Label>
            <Select value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)}>
              <option value="">None — fresh call</option>
              {bookableAppointments.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>
                  {formatDateTime(appointment.appointment_datetime)}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label>Date &amp; time to call</Label>
          <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
          <p className="text-xs text-muted-foreground">Times are India Standard Time (IST).</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Instructions for the agent (optional)</Label>
          <Textarea
            placeholder="Points the AI agent should discuss during this call…"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!personId || !scheduledAt || createSchedule.isPending}
          className="w-fit"
        >
          {createSchedule.isPending ? "Scheduling…" : "Schedule call"}
        </Button>
      </CardContent>
    </Card>
  );
}
