export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

export const ACCESS_TOKEN_COOKIE = "aica_access_token";
export const REFRESH_TOKEN_COOKIE = "aica_refresh_token";

export const CALL_TYPE_LABELS: Record<string, string> = {
  inbound: "Inbound",
  outbound_admin_scheduled: "Outbound (Admin Scheduled)",
};

export const CALL_STATUS_LABELS: Record<string, string> = {
  answered: "Answered",
  missed: "Missed",
  failed: "Failed",
  busy: "Busy",
  no_answer: "No Answer",
};

export const CALL_OUTCOME_LABELS: Record<string, string> = {
  appointment_booked: "Appointment Booked",
  appointment_rescheduled: "Appointment Rescheduled",
  callback_requested: "Callback Requested",
  no_action_taken: "No Action Taken",
};

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  booked: "Booked",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
  completed: "Completed",
  no_show: "No Show",
};

export const CALL_SCHEDULE_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  missed: "Missed",
  cancelled: "Cancelled",
};

export const CALL_PURPOSE_LABELS: Record<string, string> = {
  admin_scheduled: "Admin Scheduled",
  person_requested_callback: "Person-Requested Callback",
};
