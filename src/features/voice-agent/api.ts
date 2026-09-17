import { apiClient } from "@/lib/api-client";
import type { AgentConfig, AgentConfigUpdatePayload } from "./types";

export const voiceAgentApi = {
  get: () => apiClient.get<AgentConfig>("/voice-agent"),
  update: (payload: AgentConfigUpdatePayload) => apiClient.patch<AgentConfig>("/voice-agent", payload),
};
