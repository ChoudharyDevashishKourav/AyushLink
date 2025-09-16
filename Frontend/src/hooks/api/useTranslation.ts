// src/hooks/api/useTranslation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiError, TranslateRequest } from '../../types/fhir';
import { apiClient } from '../../lib/api-client';

export const useTranslation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: TranslateRequest) => apiClient.translateConcept(request),
    onSuccess: (data, variables) => {
      // Cache the translation result
      queryClient.setQueryData(
        ['translation', variables.system, variables.code, variables.targetSystem],
        data
      );
    },
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as ApiError;
        return apiError.status >= 500 && failureCount < 2;
      }
      return false;
    }
  });
};