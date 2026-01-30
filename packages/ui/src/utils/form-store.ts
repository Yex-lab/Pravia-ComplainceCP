'use client';

import { useForm, type UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { queryStore } from './query-helper';
import { mutationStore } from './mutation-store';
import type { QueryKey } from '@tanstack/react-query';

export type FormStoreConfig<TSchema extends z.ZodType> = {
  schema: TSchema;
  queryKey?: QueryKey;
  fetchFn?: () => Promise<Partial<z.infer<TSchema>>>;
  createFn?: (data: z.infer<TSchema>) => Promise<any>;
  updateFn?: (data: z.infer<TSchema>) => Promise<any>;
  deleteFn?: (id: string) => Promise<any>;
  invalidateQueries?: QueryKey[];
  notifications?: {
    enabled?: boolean;
    messages?: {
      creating?: string;
      created?: string;
      updating?: string;
      updated?: string;
      deleting?: string;
      deleted?: string;
      error?: string;
    };
  };
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
};

export function createFormStore<TSchema extends z.ZodType>(
  config: FormStoreConfig<TSchema>
) {
  type FormData = z.infer<TSchema>;

  return {
    // Get initial data from cache or API
    useInitialData: () => {
      if (config.queryKey && config.fetchFn) {
        return queryStore.useQueryData({
          queryKey: config.queryKey,
          queryFn: config.fetchFn,
        });
      }
      return { data: undefined, isLoading: false, error: null };
    },

    // Form hook with validation and data loading
    useForm: (props: UseFormProps<any> = {}) => {
      const { data: initialData, isLoading } = config.queryKey && config.fetchFn 
        ? queryStore.useQueryData({
            queryKey: config.queryKey,
            queryFn: config.fetchFn,
          })
        : { data: undefined, isLoading: false };

      return useForm<any>({
        resolver: zodResolver(config.schema as any), // Type assertion for v5 compatibility
        defaultValues: initialData || props.defaultValues,
        ...props,
      });
    },

    // Create mutation
    useCreate: () => {
      if (!config.createFn) throw new Error('createFn not provided');
      
      return mutationStore.useFormMutation(config.schema, {
        mutationFn: config.createFn,
        invalidateQueries: config.invalidateQueries,
        onSuccess: config.onSuccess,
        onError: config.onError,
      });
    },

    // Update mutation
    useUpdate: () => {
      if (!config.updateFn) throw new Error('updateFn not provided');
      
      return mutationStore.useFormMutation(config.schema, {
        mutationFn: config.updateFn,
        invalidateQueries: config.invalidateQueries,
        onSuccess: config.onSuccess,
        onError: config.onError,
      });
    },

    // Delete mutation
    useDelete: () => {
      if (!config.deleteFn) throw new Error('deleteFn not provided');
      
      return mutationStore.useMutation({
        mutationFn: config.deleteFn,
        invalidateQueries: config.invalidateQueries,
        onSuccess: config.onSuccess,
        onError: config.onError,
      });
    },

    // Validation schema
    schema: config.schema,
  };
}

// Initialize mutation store
export const useInitMutationStore = () => {
  const queryClient = queryStore;
  mutationStore.setQueryClient(queryClient);
};
