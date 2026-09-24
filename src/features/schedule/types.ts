import type { CallPurpose, CallScheduleStatus, RequestedBy } from "@/types/enums";

export interface CallSchedule {
  id: string;
  person_id: string;
  person_full_name?: string | null;
  person_phone_number?: string | null;
  appointment_id?: string | null;
  scheduled_at: string;
  call_purpose: CallPurpose;
  requested_by: RequestedBy;
  source_call_id?: string | null;
  admin_instructions?: string | null;
  notes?: string | null;
  status: CallScheduleStatus;
  created_by?: string | null;
  edesy_call_id?: string | null;
  created_at: string;
}

export interface CallScheduleCreatePayload {
  person_id: string;
  appointment_id?: string;
  scheduled_at: string;
  admin_instructions?: string;
  notes?: string;
}
