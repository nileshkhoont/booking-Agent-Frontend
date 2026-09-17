import { cn } from "@/lib/utils";
import { parseTranscript } from "@/features/calls/types";

export function TranscriptViewer({
  summary,
  transcript,
}: {
  summary?: string | null;
  transcript?: string | null;
}) {
  const turns = parseTranscript(transcript);

  if (!summary && turns.length === 0) {
    return <p className="text-sm text-muted-foreground">No transcript available for this call.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {summary && (
        <div className="rounded-md bg-muted p-3 text-sm">
          <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">Summary</p>
          {summary}
        </div>
      )}
      {turns.length > 0 && (
        <div className="flex flex-col gap-2">
          {turns.map((turn, index) => (
            <div
              key={index}
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                turn.role === "agent" ? "self-start bg-muted" : "self-end bg-primary text-primary-foreground",
              )}
            >
              <p className="mb-0.5 text-[10px] uppercase opacity-70">{turn.role}</p>
              {turn.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
