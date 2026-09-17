import type { CallOutcome, CallStatus, CallType, Direction } from "@/types/enums";

export interface Call {
  id: string;
  call_schedule_id?: string | null;
  person_id: string;
  appointment_id?: string | null;
  call_type: CallType;
  direction: Direction;
  call_status: CallStatus;
  start_time?: string | null;
  end_time?: string | null;
  duration_seconds?: number | null;
  transcript?: string | null;
  transcript_summary?: string | null;
  recording_url?: string | null;
  edesy_call_id?: string | null;
  outcome?: CallOutcome | null;
  created_at: string;
}

export interface TranscriptTurn {
  role: string;
  content: string;
}

/** Parses the "role: content" lines call_service.py joins transcript turns with. */
export function parseTranscript(transcript: string | null | undefined): TranscriptTurn[] {
  if (!transcript) return [];
  return transcript
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(": ");
      if (separatorIndex === -1) return { role: "unknown", content: line };
      return { role: line.slice(0, separatorIndex), content: line.slice(separatorIndex + 2) };
    });
}
