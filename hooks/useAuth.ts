"use client";

import { useQuery } from "@tanstack/react-query";
import { UnifiedAPIService } from "../services/unified-api.service";

type UseAuthOptions = { enabled?: boolean };

export function useAuth(options: UseAuthOptions = {}) {
  const query = useQuery({
    enabled: options.enabled ?? true,
    queryFn: async () => (await UnifiedAPIService.auth.me(true)).data,
    queryKey: ["auth", "me"],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 5 * 60 * 1000
  });

  return {
    error: query.error,
    isAuthenticated: Boolean(query.data),
    isLoading: query.isLoading,
    user: query.data
  };
}
