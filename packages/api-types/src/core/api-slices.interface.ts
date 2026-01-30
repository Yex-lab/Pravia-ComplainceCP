import type { QueryKey } from '@tanstack/react-query';
import type { StateCreator } from 'zustand';

/**
 * Common interface for resource slices across all APIs
 */
export interface ResourceSlice<T = any, F = any> {
  query: QueryKey;
  queryConfig: {
    queryFn: () => Promise<T[]>;
    [key: string]: any;
  };
  createSlice: StateCreator<any>;
}

/**
 * Common interface for API slice collections
 * Each API (Flux, Foundry) implements this with their specific resources
 */
export interface ApiSlices {
  [resourceName: string]: ResourceSlice;
}
