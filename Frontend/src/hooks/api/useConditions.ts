import { FhirCondition } from "../../types/fhir";
import { apiClient } from "../../lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// src/hooks/api/useConditions.ts
export const useConditions = (
  patientId?: string,
  options: { 
    count?: number; 
    offset?: number; 
    enabled?: boolean;
  } = {}
) => {
  return useQuery({
    queryKey: ['conditions', patientId, options.count, options.offset],
    queryFn: () => apiClient.listConditions({
      patient: patientId,
      _count: options.count || 20,
      _offset: options.offset || 0
    }),
    enabled: options.enabled !== false,
    staleTime: 2 * 60 * 1000, // Fresh for 2 minutes
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
};

export const useCreateCondition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (condition: FhirCondition) => apiClient.createCondition(condition),
    onSuccess: (data, variables) => {
      // Invalidate and refetch conditions list
      const patientId = variables.subject.reference.replace('Patient/', '');
      queryClient.invalidateQueries({ 
        queryKey: ['conditions', patientId] 
      });
      
      // Optimistically add to cache if we know the patient ID
      const existingData = queryClient.getQueryData(['conditions', patientId, 20, 0]);
      
      if (existingData) {
        queryClient.setQueryData(['conditions', patientId, 20, 0], (old: any) => ({
          ...old,
          content: [data, ...old.content],
          totalElements: old.totalElements + 1
        }));
      }
    },
    onError: (error, variables, context) => {
      console.error('Failed to create condition:', error);
    }
  });
};
