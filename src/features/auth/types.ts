import type { AdminRole } from "@/types/enums";

export interface Admin {
  id: string;
  name: string;
  email: string;
  phone_number?: string | null;
  role: AdminRole;
  is_active: boolean;
  last_login_at?: string | null;
  created_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
