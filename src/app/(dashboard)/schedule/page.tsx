"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorBanner } from "@/components/common/error-banner";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { QueueTable } from "@/components/schedule/queue-table";
import { useCallSchedules } from "@/features/schedule/hooks";
import { CALL_SCHEDULE_STATUS_LABELS } from "@/lib/constants";
import type { CallScheduleStatus } from "@/types/enums";

export default function SchedulePage() {
  const [status, setStatus] = useState<CallScheduleStatus | "">("pending");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useCallSchedules({ status: status || undefined, page, page_size: 20 });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Outbound call queue</h1>
        <Link href="/schedule/new" className={buttonClasses()}>
          <Plus size={16} /> Schedule a call
        </Link>
      </div>

      <div className="mb-4">
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as CallScheduleStatus | "");
            setPage(1);
          }}
          className="w-48"
        >
          <option value="">All statuses</option>
          {Object.entries(CALL_SCHEDULE_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {isLoading && <LoadingSpinner />}
      {isError && <ErrorBanner message="Failed to load the call queue" />}
      {data && data.items.length === 0 && <EmptyState title="Nothing in the queue for this filter" />}

      {data && data.items.length > 0 && (
        <>
          <QueueTable items={data.items} />
          <Pagination page={page} pageSize={20} total={data.total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
