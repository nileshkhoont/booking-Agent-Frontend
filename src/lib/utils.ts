import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// The business operates in India Standard Time (IST, UTC+5:30, no DST) — every timestamp shown
// in this UI is displayed in IST regardless of the admin's own browser/OS timezone, and every
// datetime the admin types in is interpreted as IST before it's sent to the API. The backend
// always stores UTC (see backend/src/app/utils/datetime_utils.py); this is purely a display/input
// concern on this side.
const IST_TIME_ZONE = "Asia/Kolkata";

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  return `${new Date(value).toLocaleString("en-IN", {
    timeZone: IST_TIME_ZONE,
    dateStyle: "medium",
    timeStyle: "short",
  })} IST`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { timeZone: IST_TIME_ZONE, dateStyle: "medium" });
}

/**
 * Converts a `<input type="datetime-local">` value (e.g. "2026-09-20T10:00"), which the admin
 * enters as IST wall-clock time, into a correct UTC ISO string for the API — without depending
 * on the browser's own timezone. IST has a fixed +05:30 offset (no DST), so appending it directly
 * is safe and needs no timezone library.
 */
export function istLocalInputToUtcIso(localValue: string): string {
  const withSeconds = localValue.length === 16 ? `${localValue}:00` : localValue;
  return new Date(`${withSeconds}+05:30`).toISOString();
}

/** Same idea for a plain `<input type="date">` value — treated as the start of that day in IST. */
export function istDateInputToUtcIso(dateValue: string): string {
  return new Date(`${dateValue}T00:00:00+05:30`).toISOString();
}

/** The end (23:59:59.999) of that same IST calendar day — for inclusive "to" date filters. */
export function istDateInputEndOfDayToUtcIso(dateValue: string): string {
  return new Date(`${dateValue}T23:59:59.999+05:30`).toISOString();
}
