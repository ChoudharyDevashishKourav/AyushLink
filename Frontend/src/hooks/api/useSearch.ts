
// src/hooks/api/useSearch.ts
// import { useQuery } from '~/tanstack/react-query';
import { useQueries, useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import type { ApiError } from '../../types/fhir';

export const useSearch = (
  filter: string, 
  options: { 
    count?: number; 
    offset?: number; 
    enabled?: boolean;
  } = {}
) => {
  return useQuery({
    queryKey: ['search', filter, options.count, options.offset],
    queryFn: () => apiClient.expandValueSet({
      filter,
      count: options.count || 10,
      offset: options.offset || 0
    }),
    enabled: options.enabled !== false && filter.length >= 2,
    staleTime: 0, // Always fresh for search
    gcTime: 30 * 1000, // Cache for 30 seconds
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as ApiError;
        return apiError.status >= 500 && failureCount < 3;
      }
      return failureCount < 3;
    }
  });
};
