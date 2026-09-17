"use client";

import { useState } from "react";
import Link from "next/link";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorBanner } from "@/components/common/error-banner";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { useAppointments } from "@/features/appointments/hooks";
import { APPOINTMENT_STATUS_LABELS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import type { AppointmentStatus } from "@/types/enums";

const STATUS_TONE: Record<AppointmentStatus, "success" | "warning" | "destructive" | "muted"> = {
  booked: "success",
  rescheduled: "warning",
  cancelled: "destructive",
  completed: "muted",
  no_show: "destructive",
};

export default function AppointmentsPage() {
  const [status, setStatus] = useState<AppointmentStatus | "">("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAppointments({
    status: status || undefined,
    page,
    page_size: 20,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Appointments</h1>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as AppointmentStatus | "");
            setPage(1);
          }}
          className="w-48"
        >
          <option value="">All statuses</option>
          {Object.entries(APPOINTMENT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {isLoading && <LoadingSpinner />}
      {isError && <ErrorBanner message="Failed to load appointments" />}
      {data && data.items.length === 0 && <EmptyState title="No appointments found" />}

      {data && data.items.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date &amp; time</TableHead>
                <TableHead>Person</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <Link href={`/appointments/${appointment.id}`} className="font-medium hover:underline">
                      {formatDateTime(appointment.appointment_datetime)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {appointment.person_full_name ? (
                      <Link href={`/persons/${appointment.person_id}`} className="hover:underline">
                        {appointment.person_full_name}
                      </Link>
                    ) : (
                      "—"
                    )}
                    {appointment.person_phone_number && (
                      <p className="text-xs text-muted-foreground">{appointment.person_phone_number}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge tone={STATUS_TONE[appointment.status]}>
                      {APPOINTMENT_STATUS_LABELS[appointment.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{appointment.booking_source}</TableCell>
                  <TableCell className="max-w-xs truncate">{appointment.notes ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination page={page} pageSize={20} total={data.total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
