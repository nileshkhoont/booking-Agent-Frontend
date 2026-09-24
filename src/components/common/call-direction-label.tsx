import { PhoneIncoming, PhoneOutgoing } from "lucide-react";

/** Direction icon chip followed by a text label — shared by the Calls "Type" and Appointments
 * "Source" columns so both read identically (same chip as the Overview tiles).
 */
export function CallDirectionLabel({ incoming, label }: { incoming: boolean; label: string }) {
  const Icon = incoming ? PhoneIncoming : PhoneOutgoing;
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
        <Icon size={15} aria-hidden="true" />
      </span>
      {label}
    </span>
  );
}
