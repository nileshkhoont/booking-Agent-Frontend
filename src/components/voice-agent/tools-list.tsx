import { Card, CardContent } from "@/components/ui/card";

const TOOLS = [
  { name: "identify_person", description: "Looks up (or creates) the caller by phone number and reports their appointment status." },
  { name: "check_slot_availability", description: "Checks whether a requested appointment date/time is available." },
  { name: "book_appointment", description: "Books a new first-time appointment at a confirmed-available time." },
  { name: "reschedule_appointment", description: "Reschedules the person's existing appointment to a new confirmed-available time." },
  { name: "log_callback_request", description: "Records that the caller asked to be called back at a specific date/time." },
];

export function ToolsList() {
  return (
    <div className="flex max-w-2xl flex-col gap-2">
      {TOOLS.map((tool) => (
        <Card key={tool.name}>
          <CardContent className="py-3">
            <p className="font-mono text-sm font-medium">{tool.name}</p>
            <p className="text-sm text-muted-foreground">{tool.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
