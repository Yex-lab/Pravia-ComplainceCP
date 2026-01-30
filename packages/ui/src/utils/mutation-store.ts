'use client';

import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { z } from 'zod';

export type MutationConfig<TData, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  invalidateQueries?: QueryKey[];
};

class MutationStore {
  private queryClient: any = null;

  setQueryClient(client: any) {
    this.queryClient = client;
  }

  // Generic mutation hook
  useMutation<TData, TVariables>(config: MutationConfig<TData, TVariables>) {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: config.mutationFn,
      onSuccess: (data, variables) => {
        // Invalidate related queries
        if (config.invalidateQueries) {
          config.invalidateQueries.forEach(queryKey => {
            queryClient.invalidateQueries({ queryKey });
          });
        }
        config.onSuccess?.(data, variables);
      },
      onError: config.onError,
    });
  }

  // Form mutation with Zod validation
  useFormMutation<TSchema extends z.ZodType, TData>(
    schema: TSchema,
    config: {
      mutationFn: (variables: any) => Promise<TData>;
      onSuccess?: (data: TData, variables: any) => void;
      onError?: (error: Error, variables: any) => void;
      invalidateQueries?: QueryKey[];
    }
  ) {
    return this.useMutation({
      mutationFn: async (variables: any) => {
        // Validate with Zod before mutation
        const validatedData = schema.parse(variables);
        return config.mutationFn(validatedData);
      },
      onSuccess: config.onSuccess,
      onError: config.onError,
      invalidateQueries: config.invalidateQueries,
    });
  }
}

export const mutationStore = new MutationStore();

// Generic mutation store creator
export function createMutationStore<TData, TVariables = any>(
  baseConfig: Partial<MutationConfig<TData, TVariables>> = {}
) {
  return {
    // Basic mutation
    useMutation: (config: MutationConfig<TData, TVariables>) =>
      mutationStore.useMutation({ ...baseConfig, ...config }),
    
    // Form mutation with validation
    useFormMutation: <TSchema extends z.ZodType>(
      schema: TSchema,
      config: MutationConfig<TData, z.infer<TSchema>>
    ) => mutationStore.useFormMutation(schema, { ...baseConfig, ...config }),
  };
}
