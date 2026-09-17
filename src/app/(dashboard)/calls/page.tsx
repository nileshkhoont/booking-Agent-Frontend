"use client";

import { useState } from "react";
import Link from "next/link";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorBanner } from "@/components/common/error-banner";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { CallStatusBadge } from "@/components/calls/call-status-badge";
import { useCalls } from "@/features/calls/hooks";
import { CALL_OUTCOME_LABELS, CALL_TYPE_LABELS } from "@/lib/constants";
import { formatDateTime, istDateInputEndOfDayToUtcIso, istDateInputToUtcIso } from "@/lib/utils";
import type { CallOutcome, CallStatus, CallType } from "@/types/enums";

export default function CallsPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [callType, setCallType] = useState<CallType | "">("");
  const [callStatus, setCallStatus] = useState<CallStatus | "">("");
  const [outcome, setOutcome] = useState<CallOutcome | "">("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useCalls({
    date_from: dateFrom ? istDateInputToUtcIso(dateFrom) : undefined,
    date_to: dateTo ? istDateInputEndOfDayToUtcIso(dateTo) : undefined,
    call_type: callType || undefined,
    call_status: callStatus || undefined,
    outcome: outcome || undefined,
    page,
    page_size: 20,
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Calls</h1>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">From</label>
          <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">To</label>
          <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} />
        </div>
        <Select value={callType} onChange={(e) => { setCallType(e.target.value as CallType | ""); setPage(1); }} className="w-56">
          <option value="">All call types</option>
          {Object.entries(CALL_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
        <Select value={callStatus} onChange={(e) => { setCallStatus(e.target.value as CallStatus | ""); setPage(1); }} className="w-40">
          <option value="">All statuses</option>
          <option value="answered">Answered</option>
          <option value="missed">Missed</option>
          <option value="failed">Failed</option>
          <option value="busy">Busy</option>
          <option value="no_answer">No Answer</option>
        </Select>
        <Select value={outcome} onChange={(e) => { setOutcome(e.target.value as CallOutcome | ""); setPage(1); }} className="w-56">
          <option value="">All outcomes</option>
          {Object.entries(CALL_OUTCOME_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </div>

      {isLoading && <LoadingSpinner />}
      {isError && <ErrorBanner message="Failed to load calls" />}
      {data && data.items.length === 0 && <EmptyState title="No calls found for these filters" />}

      {data && data.items.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date &amp; time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Duration</TableHead>
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
                  <TableCell>{CALL_TYPE_LABELS[call.call_type]}</TableCell>
                  <TableCell>
                    <CallStatusBadge status={call.call_status} />
                  </TableCell>
                  <TableCell>{call.outcome ? CALL_OUTCOME_LABELS[call.outcome] : "—"}</TableCell>
                  <TableCell>{call.duration_seconds ? `${call.duration_seconds}s` : "—"}</TableCell>
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
