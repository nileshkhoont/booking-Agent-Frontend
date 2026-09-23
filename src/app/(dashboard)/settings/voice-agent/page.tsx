import { AgentPromptEditor } from "@/components/voice-agent/agent-prompt-editor";
import { ToolsList } from "@/components/voice-agent/tools-list";

export default function VoiceAgentSettingsPage() {
  return (
    <div>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
        Edits here update the Edesy AI Voice Agent directly (prompt, greeting, language) — never
        holds an Edesy API key in the browser; this page talks only to this backend.
      </p>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <AgentPromptEditor />
        <div>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            Registered tools (read-only)
          </h2>
          <ToolsList />
        </div>
      </div>
    </div>
  );
}
