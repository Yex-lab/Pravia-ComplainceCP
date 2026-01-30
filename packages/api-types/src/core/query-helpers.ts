import type { QueryKey } from '@tanstack/react-query';

// Default query configurations
export const defaultQueryConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes
  refetchOnMount: false,
  refetchOnWindowFocus: false,
};

// Factory for creating query keys
export function createAppQuery(queryKey: QueryKey) {
  return queryKey;
}
