import type { AppointmentStatus, BookingSource } from "@/types/enums";

export interface Appointment {
  id: string;
  person_id: string;
  appointment_datetime: string;
  duration_minutes?: number | null;
  status: AppointmentStatus;
  booking_source: BookingSource;
  original_appointment_id?: string | null;
  notes?: string | null;
  created_by_call_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppointmentCreatePayload {
  person_id: string;
  appointment_datetime: string;
  booking_source: BookingSource;
  duration_minutes?: number;
  notes?: string;
}

export interface SlotCheckResponse {
  available: boolean;
  reason?: string | null;
}
