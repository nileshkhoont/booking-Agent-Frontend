export interface WorkingHours {
  start?: string | null;
  end?: string | null;
}

export interface Holiday {
  date: string;
  reason?: string | null;
}

export interface BusinessConfig {
  id: string;
  working_days: string[];
  working_hours?: WorkingHours | null;
  slot_duration_minutes?: number | null;
  buffer_minutes?: number | null;
  holidays: Holiday[];
  max_advance_booking_days?: number | null;
  timezone?: string | null;
  updated_at: string;
}

export type BusinessConfigUpdatePayload = Partial<
  Omit<BusinessConfig, "id" | "updated_at" | "holidays">
>;
