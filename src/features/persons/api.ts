import { apiClient } from "@/lib/api-client";
import type { Page } from "@/types/common";
import type { Person, PersonCreatePayload } from "./types";

export const personsApi = {
  list: (params: { q?: string; page?: number; page_size?: number }) =>
    apiClient.get<Page<Person>>("/persons", params),
  get: (id: string) => apiClient.get<Person>(`/persons/${id}`),
  create: (payload: PersonCreatePayload) => apiClient.post<Person>("/persons", payload),
  update: (id: string, payload: Partial<PersonCreatePayload>) =>
    apiClient.patch<Person>(`/persons/${id}`, payload),
  remove: (id: string) => apiClient.delete<void>(`/persons/${id}`),
};
