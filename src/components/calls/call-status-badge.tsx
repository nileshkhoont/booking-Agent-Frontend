import { Badge } from "@/components/ui/badge";
import { CALL_STATUS_LABELS } from "@/lib/constants";
import type { CallStatus } from "@/types/enums";

const TONE: Record<CallStatus, "success" | "warning" | "destructive" | "muted"> = {
  answered: "success",
  missed: "warning",
  failed: "destructive",
  busy: "warning",
  no_answer: "warning",
};

export function CallStatusBadge({ status }: { status: CallStatus }) {
  return <Badge tone={TONE[status]}>{CALL_STATUS_LABELS[status]}</Badge>;
}
