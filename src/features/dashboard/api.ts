import { apiClient } from "@/lib/api-client";
import type { DashboardStats } from "./types";

export const dashboardApi = {
  stats: () => apiClient.get<DashboardStats>("/dashboard/stats"),
};
