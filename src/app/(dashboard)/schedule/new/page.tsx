import { ScheduleCallForm } from "@/components/schedule/schedule-call-form";

export default async function NewSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ person_id?: string }>;
}) {
  // ?person_id=… pre-selects that person — used by the missed-call "Re-schedule" button.
  const { person_id } = await searchParams;
  return (
    <div>
      <ScheduleCallForm initialPersonId={person_id} />
    </div>
  );
}
