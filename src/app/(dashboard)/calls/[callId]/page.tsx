"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorBanner } from "@/components/common/error-banner";
import { CallStatusBadge } from "@/components/calls/call-status-badge";
import { TranscriptViewer } from "@/components/calls/transcript-viewer";
import { RecordingPlayer } from "@/components/calls/recording-player";
import { useCall } from "@/features/calls/hooks";
import { usePerson } from "@/features/persons/hooks";
import { CALL_OUTCOME_LABELS, CALL_TYPE_LABELS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";

export default function CallDetailPage() {
  const params = useParams<{ callId: string }>();
  const { data: call, isLoading, isError } = useCall(params.callId);
  const { data: person } = usePerson(call?.person_id);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !call) return <ErrorBanner message="Failed to load call" />;

  return (
    <div className="max-w-3xl">
      <Card className="mb-4">
        <CardContent className="flex flex-col gap-3 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-lg font-medium">{formatDateTime(call.start_time ?? call.created_at)}</p>
            <CallStatusBadge status={call.call_status} />
          </div>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
            <dt className="text-muted-foreground">Type</dt>
            <dd>{CALL_TYPE_LABELS[call.call_type]}</dd>
            <dt className="text-muted-foreground">Outcome</dt>
            <dd>{call.outcome ? CALL_OUTCOME_LABELS[call.outcome] : "—"}</dd>
            <dt className="text-muted-foreground">Duration</dt>
            <dd>{call.duration_seconds ? `${call.duration_seconds}s` : "—"}</dd>
            {person && (
              <>
                <dt className="text-muted-foreground">Person</dt>
                <dd>
                  <a href={`/persons/${person.id}`} className="hover:underline">
                    {person.full_name ? `${person.full_name} (${person.phone_number})` : person.phone_number}
                  </a>
                </dd>
              </>
            )}
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
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Recording</h2>
          <RecordingPlayer url={call.recording_url} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Transcript</h2>
          <TranscriptViewer summary={call.transcript_summary} transcript={call.transcript} />
        </CardContent>
      </Card>
    </div>
  );
}
