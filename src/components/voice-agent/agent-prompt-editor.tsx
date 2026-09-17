"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/common/error-banner";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useUpdateVoiceAgentConfig, useVoiceAgentConfig } from "@/features/voice-agent/hooks";
import { ApiError } from "@/lib/api-client";

export function AgentPromptEditor() {
  const { data, isLoading, isError, error } = useVoiceAgentConfig();
  const update = useUpdateVoiceAgentConfig();

  const [prompt, setPrompt] = useState("");
  const [greeting, setGreeting] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    if (data) {
      setPrompt(data.prompt);
      setGreeting(data.greetingMessage);
      setLanguage(data.language);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    const message =
      error instanceof ApiError && error.status === 400
        ? "The Edesy agent isn't configured yet — run scripts/bootstrap_edesy_agent.py on the backend once EDESY_API_KEY is set, then reload this page."
        : "Failed to load the voice agent configuration.";
    return <ErrorBanner message={message} />;
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {update.isError && (
        <ErrorBanner message={update.error instanceof ApiError ? update.error.message : "Failed to save"} />
      )}
      <div className="flex flex-col gap-1.5">
        <Label>Greeting message</Label>
        <Input value={greeting} onChange={(e) => setGreeting(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Language</Label>
        <Input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="en" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>System prompt</Label>
        <Textarea rows={16} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="font-mono text-xs" />
      </div>
      <Button
        className="w-fit"
        disabled={update.isPending}
        onClick={() =>
          update.mutate({ prompt, greeting_message: greeting, language })
        }
      >
        {update.isPending ? "Saving…" : "Save agent configuration"}
      </Button>
    </div>
  );
}
