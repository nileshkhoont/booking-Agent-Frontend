"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorBanner } from "@/components/common/error-banner";
import { useBusinessConfig, useUpdateBusinessConfig } from "@/features/business-config/hooks";
import { computeSlotPreview } from "@/features/business-config/slot-preview";
import type { WorkingHours } from "@/features/business-config/types";
import { ApiError } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

const ALL_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function BusinessConfigSettingsPage() {
  const { data, isLoading, isError } = useBusinessConfig();
  const update = useUpdateBusinessConfig();

  const [workingDays, setWorkingDays] = useState<string[]>([]);
  const [windows, setWindows] = useState<WorkingHours[]>([]);
  const [slotDuration, setSlotDuration] = useState("");
  const [bufferMinutes, setBufferMinutes] = useState("");
  const [maxAdvanceDays, setMaxAdvanceDays] = useState("");
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    if (data) {
      setWorkingDays(data.working_days);
      setWindows(data.working_hours.length > 0 ? data.working_hours : [{ start: "", end: "" }]);
      setSlotDuration(data.slot_duration_minutes?.toString() ?? "");
      setBufferMinutes(data.buffer_minutes?.toString() ?? "");
      setMaxAdvanceDays(data.max_advance_booking_days?.toString() ?? "");
      setTimezone(data.timezone ?? "");
    }
  }, [data]);

  function toggleDay(day: string) {
    setWorkingDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  function updateWindow(index: number, field: "start" | "end", value: string) {
    setWindows((prev) => prev.map((w, i) => (i === index ? { ...w, [field]: value } : w)));
  }

  function addWindow() {
    setWindows((prev) => [...prev, { start: "", end: "" }]);
  }

  function removeWindow(index: number) {
    setWindows((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    const cleanWindows = windows.filter((w) => w.start && w.end);
    update.mutate({
      working_days: workingDays,
      working_hours: cleanWindows,
      slot_duration_minutes: slotDuration ? Number(slotDuration) : undefined,
      buffer_minutes: bufferMinutes ? Number(bufferMinutes) : undefined,
      max_advance_booking_days: maxAdvanceDays ? Number(maxAdvanceDays) : undefined,
      timezone: timezone || undefined,
    });
  }

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBanner message="business_config isn't set up yet — run scripts/seed_business_config.py on the backend." />;

  const duration = slotDuration ? Number(slotDuration) : 0;

  return (
    <div className="max-w-xl">
      <h1 className="mb-2 text-xl font-semibold">Business hours</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Drives every slot-availability check — for the admin dashboard and the AI agent alike.
      </p>

      <div className="flex flex-col gap-5">
        {update.isError && (
          <ErrorBanner message={update.error instanceof ApiError ? update.error.message : "Failed to save"} />
        )}

        <div>
          <Label>Working days</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            The time windows below apply on every selected day.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ALL_DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`rounded-full border px-3 py-1 text-xs capitalize ${
                  workingDays.includes(day)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-transparent"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Slot duration (minutes)</Label>
          <Input
            type="number"
            className="max-w-[10rem]"
            value={slotDuration}
            onChange={(e) => setSlotDuration(e.target.value)}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label>Time windows</Label>
            <Button type="button" variant="outline" size="sm" onClick={addWindow}>
              + Add time window
            </Button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Add a separate window for each session in a day — e.g. a morning session and a
            separate evening session with a closed gap in between.
          </p>

          <div className="mt-3 flex flex-col gap-3">
            {windows.map((window, index) => {
              const preview = computeSlotPreview(window.start ?? "", window.end ?? "", duration);
              return (
                <div key={index} className="rounded-md border border-border p-3">
                  <div className="flex items-end gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label>Opens at</Label>
                      <Input
                        type="time"
                        value={window.start ?? ""}
                        onChange={(e) => updateWindow(index, "start", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Closes at</Label>
                      <Input
                        type="time"
                        value={window.end ?? ""}
                        onChange={(e) => updateWindow(index, "end", e.target.value)}
                      />
                    </div>
                    {windows.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mb-0.5"
                        onClick={() => removeWindow(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {duration > 0 && window.start && window.end && (
                    <div className="mt-3">
                      {preview.length > 0 ? (
                        <>
                          <p className="text-xs text-muted-foreground">
                            {preview.length} slot{preview.length === 1 ? "" : "s"} generated:
                          </p>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {preview.map((slot) => (
                              <Badge key={slot} tone="muted">
                                {slot}
                              </Badge>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-destructive">
                          No full {duration}-minute slot fits in this window — widen it or shorten
                          the slot duration.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Buffer between slots (minutes)</Label>
            <Input type="number" value={bufferMinutes} onChange={(e) => setBufferMinutes(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Max advance booking (days)</Label>
            <Input type="number" value={maxAdvanceDays} onChange={(e) => setMaxAdvanceDays(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Timezone</Label>
          <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="Asia/Kolkata" />
        </div>

        {data && data.holidays.length > 0 && (
          <div>
            <Label>Holidays</Label>
            <ul className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
              {data.holidays.map((holiday, index) => (
                <li key={index}>
                  {formatDate(holiday.date)} {holiday.reason ? `— ${holiday.reason}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button className="w-fit" disabled={update.isPending} onClick={handleSave}>
          {update.isPending ? "Saving…" : "Save business hours"}
        </Button>
      </div>
    </div>
  );
}
