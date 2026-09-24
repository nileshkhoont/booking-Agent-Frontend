"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { useCancelCallSchedule } from "@/features/schedule/hooks";
import { CALL_PURPOSE_LABELS, CALL_SCHEDULE_STATUS_LABELS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import type { CallSchedule } from "@/features/schedule/types";
import type { CallScheduleStatus } from "@/types/enums";

const STATUS_TONE: Record<CallScheduleStatus, "success" | "warning" | "destructive" | "muted"> = {
  pending: "muted",
  in_progress: "warning",
  completed: "success",
  missed: "destructive",
  cancelled: "destructive",
};

export function QueueTable({
  items,
  fillHeight,
  bare,
}: {
  items: CallSchedule[];
  fillHeight?: boolean;
  bare?: boolean;
}) {
  const cancelSchedule = useCancelCallSchedule();

  return (
    <Table fillHeight={fillHeight} bare={bare}>
      <TableHeader>
        <TableRow>
          <TableHead>Scheduled for</TableHead>
          <TableHead>Person</TableHead>
          <TableHead>Purpose</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((schedule) => (
          <TableRow key={schedule.id}>
            <TableCell>{formatDateTime(schedule.scheduled_at)}</TableCell>
            <TableCell>
              {schedule.person_full_name ? (
                <Link href={`/persons/${schedule.person_id}`} className="hover:underline">
                  {schedule.person_full_name}
                </Link>
              ) : (
                "—"
              )}
              {schedule.person_phone_number && (
                <p className="text-xs text-muted-foreground">{schedule.person_phone_number}</p>
              )}
            </TableCell>
            <TableCell>
              <Badge tone="muted">{CALL_PURPOSE_LABELS[schedule.call_purpose]}</Badge>
            </TableCell>
            <TableCell>
              <Badge tone={STATUS_TONE[schedule.status]}>{CALL_SCHEDULE_STATUS_LABELS[schedule.status]}</Badge>
            </TableCell>
            <TableCell className="max-w-xs truncate" title={schedule.notes ?? undefined}>
              {schedule.notes ?? "—"}
            </TableCell>
            <TableCell>
              {schedule.status === "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cancelSchedule.mutate(schedule.id)}
                  disabled={cancelSchedule.isPending}
                >
                  Cancel
                </Button>
              )}
              {schedule.status === "missed" && (
                <Link
                  href={`/schedule/new?person_id=${schedule.person_id}`}
                  className={buttonClasses("outline", "sm")}
                >
                  <RotateCcw size={14} /> Re-schedule
                </Link>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
