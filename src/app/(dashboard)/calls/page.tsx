"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorBanner } from "@/components/common/error-banner";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { FilterButton } from "@/components/common/filter-button";
import { FilterDialog } from "@/components/common/filter-dialog";
import { ListCard } from "@/components/common/list-card";
import { CallDirectionLabel } from "@/components/common/call-direction-label";
import { CallStatusBadge } from "@/components/calls/call-status-badge";
import { CallDetailModal } from "@/components/calls/call-detail-modal";
import { useCalls } from "@/features/calls/hooks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { CALL_OUTCOME_LABELS, CALL_TYPE_LABELS } from "@/lib/constants";
import { formatDateTime, formatDuration, istDateInputEndOfDayToUtcIso, istDateInputToUtcIso } from "@/lib/utils";
import type { CallOutcome, CallStatus, CallType } from "@/types/enums";

interface CallFilters {
  dateFrom: string;
  dateTo: string;
  callType: CallType | "";
  callStatus: CallStatus | "";
  outcome: CallOutcome | "";
}

const EMPTY_CALL_FILTERS: CallFilters = { dateFrom: "", dateTo: "", callType: "", callStatus: "", outcome: "" };

function countActiveFilters(filters: CallFilters) {
  return Object.values(filters).filter(Boolean).length;
}

export default function CallsPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<CallFilters>(EMPTY_CALL_FILTERS);
  const [draft, setDraft] = useState<CallFilters>(EMPTY_CALL_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [viewCallId, setViewCallId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading, isError } = useCalls({
    date_from: filters.dateFrom ? istDateInputToUtcIso(filters.dateFrom) : undefined,
    date_to: filters.dateTo ? istDateInputEndOfDayToUtcIso(filters.dateTo) : undefined,
    call_type: filters.callType || undefined,
    call_status: filters.callStatus || undefined,
    outcome: filters.outcome || undefined,
    q: debouncedSearch || undefined,
    page,
    page_size: 20,
  });

  function openFilters() {
    setDraft(filters);
    setFilterOpen(true);
  }

  function applyFilters() {
    setFilters(draft);
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
            <FilterButton activeCount={countActiveFilters(filters)} onClick={openFilters} />
          </>
        }
      >
        {isLoading && <LoadingSpinner className="flex-1" />}
        {isError && (
          <div className="p-4">
            <ErrorBanner message="Failed to load calls" />
          </div>
        )}
        {data && data.items.length === 0 && (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState title="No calls found for these filters" />
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
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>
                    <Link href={`/calls/${call.id}`} className="font-medium hover:underline">
                      {formatDateTime(call.start_time ?? call.created_at)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {call.person_full_name ? (
                      <Link href={`/persons/${call.person_id}`} className="hover:underline">
                        {call.person_full_name}
                      </Link>
                    ) : (
                      "—"
                    )}
                    {call.person_phone_number && (
                      <p className="text-xs text-muted-foreground">{call.person_phone_number}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <CallDirectionLabel
                      incoming={call.call_type === "inbound"}
                      label={CALL_TYPE_LABELS[call.call_type] ?? call.call_type}
                    />
                  </TableCell>
                  <TableCell>
                    <CallStatusBadge status={call.call_status} />
                  </TableCell>
                  <TableCell>{formatDuration(call.duration_seconds)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setViewCallId(call.id)}>
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

      <CallDetailModal callId={viewCallId} open={viewCallId !== null} onClose={() => setViewCallId(null)} />

      <FilterDialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={applyFilters}
        onClear={() => setDraft(EMPTY_CALL_FILTERS)}
        title="Filter calls"
      >
        <div className="flex flex-col gap-1.5">
          <Label>From</Label>
          <Input
            type="date"
            value={draft.dateFrom}
            onChange={(e) => setDraft((d) => ({ ...d, dateFrom: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>To</Label>
          <Input
            type="date"
            value={draft.dateTo}
            onChange={(e) => setDraft((d) => ({ ...d, dateTo: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Call type</Label>
          <Select
            value={draft.callType}
            onChange={(e) => setDraft((d) => ({ ...d, callType: e.target.value as CallType | "" }))}
          >
            <option value="">All call types</option>
            {Object.entries(CALL_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Status</Label>
          <Select
            value={draft.callStatus}
            onChange={(e) => setDraft((d) => ({ ...d, callStatus: e.target.value as CallStatus | "" }))}
          >
            <option value="">All statuses</option>
            <option value="answered">Answered</option>
            <option value="busy">Busy</option>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Outcome</Label>
          <Select
            value={draft.outcome}
            onChange={(e) => setDraft((d) => ({ ...d, outcome: e.target.value as CallOutcome | "" }))}
          >
            <option value="">All outcomes</option>
            {Object.entries(CALL_OUTCOME_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </div>
      </FilterDialog>
    </div>
  );
}
