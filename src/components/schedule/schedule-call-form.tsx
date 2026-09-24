"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/common/error-banner";
import { useCreatePerson, usePerson, usePersonByPhone, usePersons } from "@/features/persons/hooks";
import { useBookableAppointments } from "@/features/appointments/hooks";
import { useCreateCallSchedule } from "@/features/schedule/hooks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn, formatDateTime, istLocalInputToUtcIso } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";

// Temporarily hidden — flip to true to bring back the "link to an existing booked appointment" field.
const SHOW_APPOINTMENT_LINK = false;

type PersonMode = "existing" | "new";

/** Turns what an admin types into E.164, assuming India (+91) for a bare 10-digit number — the
 * same format every stored/agent-resolved number uses, so the duplicate check and the saved value
 * can't disagree ("98765 43210" vs "+919876543210"). Returns null if it isn't a plausible number.
 */
function normalizePhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s\-().]/g, "");
  if (!cleaned) return null;
  let e164: string;
  if (cleaned.startsWith("+")) e164 = cleaned;
  else if (/^\d{10}$/.test(cleaned)) e164 = `+91${cleaned}`;
  else if (/^91\d{10}$/.test(cleaned)) e164 = `+${cleaned}`;
  else return null;
  return /^\+\d{8,15}$/.test(e164) ? e164 : null;
}

export function ScheduleCallForm({ initialPersonId }: { initialPersonId?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<PersonMode>("existing");

  // "Select from list" mode
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [personId, setPersonId] = useState(initialPersonId ?? "");

  // "Add new person" mode
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [createdPersonId, setCreatedPersonId] = useState("");
  const normalizedPhone = normalizePhone(newPhone);
  const debouncedPhone = useDebouncedValue(normalizedPhone);

  const [appointmentId, setAppointmentId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");

  const { data: personResults } = usePersons({ q: debouncedSearch || undefined, page: 1, page_size: 10 });
  // A pre-selected person (from a missed call's "Re-schedule") may not be in the first page of
  // search results, so it's fetched on its own and shown as an option regardless.
  const { data: preselectedPerson } = usePerson(initialPersonId);
  const personOptions = [
    ...(preselectedPerson && !personResults?.items.some((p) => p.id === preselectedPerson.id)
      ? [preselectedPerson]
      : []),
    ...(personResults?.items ?? []),
  ];
  const { data: bookableAppointments } = useBookableAppointments(personId || undefined);
  const phoneLookup = usePersonByPhone(mode === "new" ? (debouncedPhone ?? undefined) : undefined);
  const createPerson = useCreatePerson();
  const createSchedule = useCreateCallSchedule();

  // The lookup answers for the debounced number — while the admin is still typing (or the number
  // was just edited) that answer is stale, so it only counts once it matches the current input.
  const phoneCheckSettled =
    Boolean(normalizedPhone) && debouncedPhone === normalizedPhone && phoneLookup.isSuccess && !phoneLookup.isFetching;
  const existingMatch = phoneCheckSettled ? phoneLookup.data : undefined;
  const phoneIsFree = phoneCheckSettled && phoneLookup.data === null;

  const newPersonReady = Boolean(normalizedPhone) && (phoneIsFree || Boolean(createdPersonId));
  const personReady = mode === "existing" ? Boolean(personId) : newPersonReady;
  const isBusy = createPerson.isPending || createSchedule.isPending;

  function switchMode(next: PersonMode) {
    setMode(next);
    setAppointmentId("");
  }

  function selectExistingPerson(id: string, phone: string) {
    setPersonId(id);
    setSearch(phone);
    switchMode("existing");
  }

  async function handleSubmit() {
    if (!personReady || !scheduledAt) return;

    let targetPersonId = personId;
    if (mode === "new") {
      // Create the person first; if scheduling then fails, keep the id so a retry doesn't try to
      // create the same number again (which the backend would reject as a duplicate).
      targetPersonId = createdPersonId;
      if (!targetPersonId && normalizedPhone) {
        try {
          const person = await createPerson.mutateAsync({
            phone_number: normalizedPhone,
            full_name: newName.trim() || undefined,
          });
          targetPersonId = person.id;
          setCreatedPersonId(person.id);
        } catch {
          return; // the error banner below shows createPerson.error
        }
      }
    }

    createSchedule.mutate(
      {
        person_id: targetPersonId,
        appointment_id: appointmentId || undefined,
        scheduled_at: istLocalInputToUtcIso(scheduledAt),
        notes: notes.trim() || undefined,
      },
      { onSuccess: () => router.push("/schedule") },
    );
  }

  const errorMessage = createPerson.isError
    ? createPerson.error instanceof ApiError
      ? createPerson.error.message
      : "Failed to add person"
    : createSchedule.isError
      ? createSchedule.error instanceof ApiError
        ? createSchedule.error.message
        : "Failed to schedule call"
      : null;

  return (
    <Card className="max-w-xl">
      <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
        {errorMessage && <ErrorBanner message={errorMessage} />}

        <div className="flex flex-col gap-2">
          <Label className="text-base">Person</Label>
          <div className="inline-flex w-fit rounded-md border border-border bg-muted p-0.5" role="group" aria-label="Person source">
            {(
              [
                ["existing", "Select from list"],
                ["new", "Add new person"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={mode === value}
                onClick={() => switchMode(value)}
                className={cn(
                  "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                  mode === value ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {mode === "existing" ? (
          <div className="flex flex-col gap-1.5">
            <Input
              placeholder="Search by name or phone number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {personOptions.length > 0 && (
              <Select
                value={personId}
                onChange={(e) => {
                  setPersonId(e.target.value);
                  setAppointmentId("");
                }}
              >
                <option value="">Select a person…</option>
                {personOptions.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.full_name ? `${person.full_name} (${person.phone_number})` : person.phone_number}
                  </option>
                ))}
              </Select>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4 rounded-md border border-border p-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-person-phone" className="text-base">Phone number</Label>
              <Input
                id="new-person-phone"
                inputMode="tel"
                placeholder="+919876543210 or 9876543210"
                value={newPhone}
                onChange={(e) => {
                  setNewPhone(e.target.value);
                  setCreatedPersonId("");
                }}
              />
              <PhoneStatus
                raw={newPhone}
                normalized={normalizedPhone}
                checking={Boolean(normalizedPhone) && !phoneCheckSettled}
                free={phoneIsFree}
                created={Boolean(createdPersonId)}
                existingName={existingMatch ? existingMatch.full_name || existingMatch.phone_number : null}
                onUseExisting={
                  existingMatch ? () => selectExistingPerson(existingMatch.id, existingMatch.phone_number) : undefined
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-person-name" className="text-base">Name (optional)</Label>
              <Input id="new-person-name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
          </div>
        )}

        {SHOW_APPOINTMENT_LINK &&
          mode === "existing" &&
          personId &&
          bookableAppointments &&
          bookableAppointments.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-base">Link to an existing booked appointment (optional)</Label>
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
          <Label className="text-base">Date &amp; time to call</Label>
          <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
          <p className="text-xs text-muted-foreground">Times are India Standard Time (IST).</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-base">Notes (optional)</Label>
          <Textarea
            placeholder="Add a note for your own reference…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Only visible to admins — not shared with the AI agent.</p>
        </div>

        <Button onClick={handleSubmit} disabled={!personReady || !scheduledAt || isBusy} className="w-fit">
          {createPerson.isPending
            ? "Adding person…"
            : createSchedule.isPending
              ? "Scheduling…"
              : mode === "new"
                ? "Add person & schedule call"
                : "Schedule call"}
        </Button>
      </CardContent>
    </Card>
  );
}

function PhoneStatus({
  raw,
  normalized,
  checking,
  free,
  created,
  existingName,
  onUseExisting,
}: {
  raw: string;
  normalized: string | null;
  checking: boolean;
  free: boolean;
  created: boolean;
  existingName: string | null;
  onUseExisting?: () => void;
}) {
  if (!raw.trim()) {
    return <p className="text-xs text-muted-foreground">Enter the number with country code, or a 10-digit Indian number.</p>;
  }
  if (!normalized) {
    return <p className="text-xs text-destructive">Enter a valid phone number, e.g. +919876543210.</p>;
  }
  if (created) {
    return (
      <p className="flex items-center gap-1.5 text-xs text-success">
        <CheckCircle2 size={14} /> Person added ({normalized})
      </p>
    );
  }
  if (checking) {
    return (
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 size={14} className="animate-spin" /> Checking {normalized}…
      </p>
    );
  }
  if (existingName) {
    return (
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-destructive">
        <span className="flex items-center gap-1.5">
          <XCircle size={14} /> {normalized} already exists ({existingName}).
        </span>
        {onUseExisting && (
          <button type="button" onClick={onUseExisting} className="font-medium text-accent underline underline-offset-2">
            Use this person instead
          </button>
        )}
      </p>
    );
  }
  if (free) {
    return (
      <p className="flex items-center gap-1.5 text-xs text-success">
        <CheckCircle2 size={14} /> {normalized} is not registered yet — it will be added when you schedule.
      </p>
    );
  }
  return null;
}
