export interface AgentConfig {
  id: string;
  name: string;
  prompt: string;
  greetingMessage: string;
  language: string;
  voice?: string | null;
  llmProvider?: string | null;
}

export interface AgentConfigUpdatePayload {
  prompt?: string;
  greeting_message?: string;
  language?: string;
  voice?: string;
}
