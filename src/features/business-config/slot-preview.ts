function toMinutes(hhmm: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function toHHMM(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Mirrors the backend's slot_service._fits_and_aligns exactly: a slot is only included if it
 * fully fits before the window closes, so e.g. 11:00-13:30 with 20-min slots stops at 13:00-13:20
 * — the last 10 minutes (13:20-13:30) are never offered as a slot.
 */
export function computeSlotPreview(start: string, end: string, durationMinutes: number): string[] {
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  if (startMin === null || endMin === null || endMin <= startMin || durationMinutes <= 0) {
    return [];
  }

  const slots: string[] = [];
  for (let cursor = startMin; cursor + durationMinutes <= endMin; cursor += durationMinutes) {
    slots.push(`${toHHMM(cursor)}-${toHHMM(cursor + durationMinutes)}`);
  }
  return slots;
}
