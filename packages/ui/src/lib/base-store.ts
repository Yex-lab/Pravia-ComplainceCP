 
import type { QueryKey } from '@tanstack/react-query';
import type { z } from 'zod';
import { createQueryHelper, createFormStore } from '../utils';
 

// Default query configurations
export const defaultQueryConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 30 * 60 * 1000,   // 30 minutes
  refetchOnMount: false,
  refetchOnWindowFocus: false,
};

// Factory for creating query helpers with defaults
export function createAppQuery(queryKey: QueryKey) {
  return createQueryHelper(queryKey);
}

// Deprecated: Use createAppQuery instead
export const createAppQueryStore = createAppQuery;

// Factory for creating form stores with notifications
export function createAppFormStore<TSchema extends z.ZodType>(config: any) {
  return createFormStore({
    ...config,
    notifications: {
      enabled: true,
      ...config.notifications,
    },
  });
}

// Re-export createQuerySlice for Zustand slices
export { createQuerySlice, type QuerySliceState } from './create-query-slice';
export { createSlice } from './create-slice';
