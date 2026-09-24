const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!apiBaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env (local) or the hosting provider's environment variables (e.g. Vercel), then rebuild.",
  );
}

export const API_BASE_URL = apiBaseUrl.replace(/\/+$/, "");

export const ACCESS_TOKEN_COOKIE = "aica_access_token";
export const REFRESH_TOKEN_COOKIE = "aica_refresh_token";

export const CALL_TYPE_LABELS: Record<string, string> = {
  inbound: "Incoming call",
  outbound_admin_scheduled: "Outgoing call",
};

export const CALL_STATUS_LABELS: Record<string, string> = {
  answered: "Answered",
  busy: "Busy",
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

export const BOOKING_SOURCE_LABELS: Record<string, string> = {
  inbound_call: "Incoming call",
  admin_scheduled_call: "Outgoing call",
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
