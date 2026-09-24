import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { personsApi } from "./api";
import type { PersonCreatePayload } from "./types";

export function usePersons(params: { q?: string; page?: number; page_size?: number }) {
  return useQuery({
    queryKey: ["persons", params],
    queryFn: () => personsApi.list(params),
  });
}

export function usePerson(id: string | undefined) {
  return useQuery({
    queryKey: ["persons", id],
    queryFn: () => personsApi.get(id as string),
    enabled: Boolean(id),
  });
}

/** Exact-match check for "does a person with this number already exist" — `phone` should already
 * be normalised; pass undefined to skip the request.
 */
export function usePersonByPhone(phone: string | undefined) {
  return useQuery({
    queryKey: ["persons", "by-phone", phone],
    queryFn: () => personsApi.lookupByPhone(phone as string),
    enabled: Boolean(phone),
    staleTime: 0,
  });
}

export function useCreatePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PersonCreatePayload) => personsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["persons"] }),
  });
}
