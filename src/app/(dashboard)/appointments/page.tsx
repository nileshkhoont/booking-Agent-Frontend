"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorBanner } from "@/components/common/error-banner";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { FilterButton } from "@/components/common/filter-button";
import { FilterDialog } from "@/components/common/filter-dialog";
import { ListCard } from "@/components/common/list-card";
import { CallDetailModal } from "@/components/calls/call-detail-modal";
import { useAppointments } from "@/features/appointments/hooks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "">("");
  const [draftStatus, setDraftStatus] = useState<AppointmentStatus | "">("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [viewCallId, setViewCallId] = useState<string | null | undefined>(undefined);
  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading, isError } = useAppointments({
    status: status || undefined,
    q: debouncedSearch || undefined,
    page,
    page_size: 20,
  });

  function openFilters() {
    setDraftStatus(status);
    setFilterOpen(true);
  }

  function applyFilters() {
    setStatus(draftStatus);
    setPage(1);
    setFilterOpen(false);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ListCard
        toolbarClassName="justify-between"
        toolbar={
          <>
            <div className="relative w-full max-w-sm">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by person name or phone number"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <FilterButton activeCount={status ? 1 : 0} onClick={openFilters} />
          </>
        }
      >
        {isLoading && <LoadingSpinner className="flex-1" />}
        {isError && (
          <div className="p-4">
            <ErrorBanner message="Failed to load appointments" />
          </div>
        )}
        {data && data.items.length === 0 && (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState title="No appointments found" />
          </div>
        )}

        {data && data.items.length > 0 && (
          <>
          <div className="min-h-0 flex-1">
          <Table fillHeight bare>
            <TableHeader>
              <TableRow>
                <TableHead>Date &amp; time</TableHead>
                <TableHead>Person</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead />
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
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewCallId(appointment.created_by_call_id ?? null)}
                    >
                      View more
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          <Pagination page={page} pageSize={20} total={data.total} onPageChange={setPage} />
          </>
        )}
      </ListCard>

      <CallDetailModal
        callId={viewCallId}
        open={viewCallId !== undefined}
        onClose={() => setViewCallId(undefined)}
      />

      <FilterDialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={applyFilters}
        onClear={() => setDraftStatus("")}
        title="Filter appointments"
      >
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Status</Label>
          <Select
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value as AppointmentStatus | "")}
          >
            <option value="">All statuses</option>
            {Object.entries(APPOINTMENT_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </FilterDialog>
    </div>
  );
}
