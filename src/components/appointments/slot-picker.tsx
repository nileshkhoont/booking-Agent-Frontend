"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { appointmentsApi } from "@/features/appointments/api";
import { ApiError } from "@/lib/api-client";
import { istLocalInputToUtcIso } from "@/lib/utils";

export function SlotPicker({
  value,
  onChange,
  excludeAppointmentId,
}: {
  value: string;
  onChange: (value: string) => void;
  excludeAppointmentId?: string;
}) {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ available: boolean; reason?: string | null } | null>(null);

  async function checkAvailability() {
    if (!value) return;
    setChecking(true);
    setResult(null);
    try {
      const response = await appointmentsApi.checkSlot(istLocalInputToUtcIso(value), excludeAppointmentId);
      setResult(response);
    } catch (err) {
      setResult({ available: false, reason: err instanceof ApiError ? err.message : "Check failed" });
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="datetime-local"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setResult(null);
          }}
        />
        <Button type="button" variant="outline" onClick={checkAvailability} disabled={!value || checking}>
          {checking ? "Checking…" : "Check slot"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Times are India Standard Time (IST).</p>
      {result && (
        <Badge tone={result.available ? "success" : "destructive"} className="w-fit">
          {result.available ? "Available" : result.reason ?? "Not available"}
        </Badge>
      )}
    </div>
  );
}
