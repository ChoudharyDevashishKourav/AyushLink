
// src/hooks/api/useSystemInfo.ts

import { apiClient } from "../../lib/api-client";
import { useQuery } from "@tanstack/react-query";


export const useSystemInfo = () => {
  return useQuery({
    queryKey: ['systemInfo'],
    queryFn: () => apiClient.getSystemInfo(),
    staleTime: 5 * 60 * 1000, // Fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache for 30 minutes
    retry: 1
  });
};