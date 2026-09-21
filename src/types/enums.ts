export type AdminRole = "super_admin" | "admin" | "viewer";

export type AppointmentStatus = "booked" | "rescheduled" | "cancelled" | "completed" | "no_show";
export type BookingSource = "inbound_call" | "admin_scheduled_call";

export type CallType = "inbound" | "outbound_admin_scheduled";
export type Direction = "inbound" | "outbound";
export type CallStatus = "answered" | "missed" | "failed" | "busy" | "no_answer";
export type CallOutcome =
  | "appointment_booked"
  | "appointment_rescheduled"
  | "callback_requested"
  | "no_action_taken";

export type CallPurpose = "admin_scheduled" | "person_requested_callback";
export type RequestedBy = "admin" | "system" | "person";
export type CallScheduleStatus = "pending" | "in_progress" | "completed" | "missed" | "cancelled";
