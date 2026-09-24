"use client";

import { Dialog } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorBanner } from "@/components/common/error-banner";
import { CallStatusBadge } from "@/components/calls/call-status-badge";
import { TranscriptViewer } from "@/components/calls/transcript-viewer";
import { RecordingPlayer } from "@/components/calls/recording-player";
import { useCall } from "@/features/calls/hooks";
import { usePerson } from "@/features/persons/hooks";
import { CALL_OUTCOME_LABELS, CALL_TYPE_LABELS } from "@/lib/constants";
import { formatDateTime, formatDuration } from "@/lib/utils";

/**
 * Shared "View more" detail panel for both the Calls and Appointments tables — opened from
 * either a call's own id, or an appointment's created_by_call_id. A modal (not a page link) so
 * neither table's filters/pagination (plain useState, not URL-synced) get lost by navigating
 * away and back.
 */
export function CallDetailModal({
  callId,
  open,
  onClose,
}: {
  callId: string | null | undefined;
  open: boolean;
  onClose: () => void;
}) {
  const { data: call, isLoading, isError } = useCall(open && callId ? callId : undefined);
  const { data: person } = usePerson(call?.person_id);

  return (
    <Dialog open={open} onClose={onClose} title="Call details" className="max-w-2xl">
      {!callId && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No call is linked to this record.
        </p>
      )}

      {callId && isLoading && <LoadingSpinner />}
      {callId && isError && <ErrorBanner message="Failed to load call" />}

      {callId && call && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-medium">{formatDateTime(call.start_time ?? call.created_at)}</p>
            <CallStatusBadge status={call.call_status} />
          </div>

          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
            <dt className="text-muted-foreground">Person</dt>
            <dd>
              {person ? (
                <a href={`/persons/${person.id}`} className="hover:underline">
                  {person.full_name ? `${person.full_name} (${person.phone_number})` : person.phone_number}
                </a>
              ) : (
                "—"
              )}
            </dd>
            <dt className="text-muted-foreground">Call type</dt>
            <dd>{CALL_TYPE_LABELS[call.call_type]}</dd>
            <dt className="text-muted-foreground">Outcome</dt>
            <dd>{call.outcome ? CALL_OUTCOME_LABELS[call.outcome] : "—"}</dd>
            <dt className="text-muted-foreground">Duration</dt>
            <dd>{formatDuration(call.duration_seconds)}</dd>
            {call.appointment_id && (
              <>
                <dt className="text-muted-foreground">Appointment</dt>
                <dd>
                  <a href={`/appointments/${call.appointment_id}`} className="hover:underline">
                    View appointment
                  </a>
                </dd>
              </>
            )}
          </dl>

          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Recording</h3>
            <RecordingPlayer url={call.recording_url} />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Transcript</h3>
            <TranscriptViewer summary={call.transcript_summary} transcript={call.transcript} />
          </div>
        </div>
      )}
    </Dialog>
  );
}
