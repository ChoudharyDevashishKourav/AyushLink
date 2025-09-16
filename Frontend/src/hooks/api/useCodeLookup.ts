import { apiClient } from "../../lib/api-client";
import { useQuery } from "@tanstack/react-query";

// src/hooks/api/useCodeLookup.ts
export const useCodeLookup = (
  system: string, 
  code: string, 
  options: { enabled?: boolean } = {}
) => {
  return useQuery({
    queryKey: ['codeLookup', system, code],
    queryFn: () => apiClient.lookupCode({ system, code }),
    enabled: options.enabled !== false && !!system && !!code,
    staleTime: 5 * 60 * 1000, // Fresh for 5 minutes
    gcTime: 60 * 60 * 1000, // Cache for 1 hour
    retry: 2
  });
};