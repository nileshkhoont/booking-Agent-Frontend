"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorBanner } from "@/components/common/error-banner";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { FilterButton } from "@/components/common/filter-button";
import { FilterDialog } from "@/components/common/filter-dialog";
import { ListCard } from "@/components/common/list-card";
import { QueueTable } from "@/components/schedule/queue-table";
import { useCallSchedules } from "@/features/schedule/hooks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { istDateInputEndOfDayToUtcIso, istDateInputToUtcIso } from "@/lib/utils";
import { CALL_SCHEDULE_STATUS_LABELS } from "@/lib/constants";
import type { CallScheduleStatus } from "@/types/enums";

interface QueueFilters {
  status: CallScheduleStatus | "";
  dateFrom: string;
  dateTo: string;
}

const EMPTY_FILTERS: QueueFilters = { status: "", dateFrom: "", dateTo: "" };

// The date range counts as ONE active filter however many of its ends are set.
function countActiveFilters(filters: QueueFilters) {
  return (filters.status ? 1 : 0) + (filters.dateFrom || filters.dateTo ? 1 : 0);
}

export default function SchedulePage() {
  const [search, setSearch] = useState("");
  // Opens on the Missed queue, all dates — missed calls are historical, so no default date range.
  const [filters, setFilters] = useState<QueueFilters>({ ...EMPTY_FILTERS, status: "missed" });
  const [draft, setDraft] = useState<QueueFilters>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading, isError } = useCallSchedules({
    status: filters.status || undefined,
    q: debouncedSearch || undefined,
    date_from: filters.dateFrom ? istDateInputToUtcIso(filters.dateFrom) : undefined,
    date_to: filters.dateTo ? istDateInputEndOfDayToUtcIso(filters.dateTo) : undefined,
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
      <div className="mb-4 flex shrink-0 justify-end">
        <Link href="/schedule/new" className={buttonClasses("default", "md", "justify-center")}>
          <Plus size={16} /> Schedule a call
        </Link>
      </div>

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
            <ErrorBanner message="Failed to load the call queue" />
          </div>
        )}
        {data && data.items.length === 0 && (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState title="Nothing in the queue for these filters" />
          </div>
        )}

        {data && data.items.length > 0 && (
          <>
          <div className="min-h-0 flex-1">
            <QueueTable items={data.items} fillHeight bare />
          </div>
          <Pagination page={page} pageSize={20} total={data.total} onPageChange={setPage} />
          </>
        )}
      </ListCard>

      <FilterDialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={applyFilters}
        onClear={() => setDraft(EMPTY_FILTERS)}
        title="Filter queue"
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
          <Label>Status</Label>
          <Select
            value={draft.status}
            onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as CallScheduleStatus | "" }))}
          >
            <option value="">All statuses</option>
            {Object.entries(CALL_SCHEDULE_STATUS_LABELS).map(([value, label]) => (
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
