import { Badge } from "@/components/ui/badge";
import { CALL_PURPOSE_LABELS } from "@/lib/constants";
import type { CallSchedule } from "@/features/schedule/types";

export function RetryChainView({ schedule }: { schedule: CallSchedule }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Badge tone="muted">{CALL_PURPOSE_LABELS[schedule.call_purpose]}</Badge>
      <span>
        Attempt {schedule.attempt_number} of {schedule.max_attempts}
      </span>
      {schedule.parent_schedule_id && <span>· retry of a previous attempt</span>}
    </div>
  );
}
