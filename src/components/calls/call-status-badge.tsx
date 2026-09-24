import { Badge } from "@/components/ui/badge";
import { CALL_STATUS_LABELS } from "@/lib/constants";
import type { CallStatus } from "@/types/enums";

const TONE: Record<CallStatus, "success" | "warning" | "destructive" | "muted"> = {
  answered: "success",
  busy: "warning",
};

// The backend can still store other statuses (e.g. failed/no_answer from a webhook); they're not
// offered in the UI anymore, but a stray one must render as a plain badge, not a blank/broken one.
export function CallStatusBadge({ status }: { status: CallStatus }) {
  return <Badge tone={TONE[status] ?? "muted"}>{CALL_STATUS_LABELS[status] ?? status}</Badge>;
}
