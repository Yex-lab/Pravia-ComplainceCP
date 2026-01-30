'use client';

import { useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export type QueryConfig<T> = {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
  staleTime?: number;
  cacheTime?: number;
  enabled?: boolean;
};

class QueryStore {
  private queryClient: any = null;
  private subscribers = new Map<string, Set<(data: any) => void>>();

  setQueryClient(client: any) {
    this.queryClient = client;
  }

  // Get cached data directly (non-reactive)
  getData<T>(queryKey: QueryKey): T | undefined {
    return this.queryClient?.getQueryData(queryKey);
  }

  // Set data in cache and mark as fetched
  setData<T>(queryKey: QueryKey, data: T) {
    this.queryClient?.setQueryData(queryKey, data);
    // Mark the query as successfully fetched to prevent immediate refetch
    this.queryClient?.setQueryState(queryKey, {
      dataUpdatedAt: Date.now(),
      status: 'success',
    });
  }

  // Fetch data using queryClient (properly sets query state)
  async fetch<T>(queryKey: QueryKey, queryFn: () => Promise<T>): Promise<T> {
    if (!this.queryClient) {
      throw new Error('QueryClient not initialized');
    }
    return this.queryClient.fetchQuery({ queryKey, queryFn });
  }

  // Invalidate query
  invalidate(queryKey: QueryKey) {
    this.queryClient?.invalidateQueries({ queryKey });
  }

  // Subscribe to query data changes
  subscribe<T>(queryKey: QueryKey, callback: (data: T | undefined) => void) {
    const key = JSON.stringify(queryKey);
    
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    
    this.subscribers.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subs = this.subscribers.get(key);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscribers.delete(key);
        }
      }
    };
  }

  // Notify subscribers when data changes
  private notifySubscribers(queryKey: QueryKey, data: any) {
    const key = JSON.stringify(queryKey);
    const subs = this.subscribers.get(key);
    if (subs) {
      subs.forEach(callback => callback(data));
    }
  }

  // Hook for reactive data access
  useQueryData<T>(config: QueryConfig<T>) {
    const { data, isLoading, error, refetch } = useQuery({
      queryKey: config.queryKey,
      queryFn: config.queryFn,
      staleTime: config.staleTime,
      gcTime: config.cacheTime,
      enabled: config.enabled,
    });

    // Notify subscribers when data changes
    useEffect(() => {
      this.notifySubscribers(config.queryKey, data);
    }, [data, config.queryKey]);

    return { data, isLoading, error, refetch };
  }

  // Hook for subscribing to existing query data
  useSubscribe<T>(queryKey: QueryKey) {
    const [data, setData] = useState<T | undefined>(() => this.getData(queryKey));

    useEffect(() => {
      const unsubscribe = this.subscribe<T>(queryKey, setData);
      return unsubscribe;
    }, [JSON.stringify(queryKey)]);

    return data;
  }
}

export const queryStore = new QueryStore();

// Hook to initialize the store with query client
export const useInitQueryStore = () => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    queryStore.setQueryClient(queryClient);
  }, [queryClient]);
};

// Generic helper creator
export function createQueryHelper<T>(queryKey: QueryKey) {
  return {
    // Get data directly (non-reactive)
    getData: () => queryStore.getData<T>(queryKey),
    
    // Set data in cache
    setData: (data: T) => queryStore.setData(queryKey, data),
    
    // Fetch data properly through queryClient
    fetch: (queryFn: () => Promise<T>) => queryStore.fetch(queryKey, queryFn),
    
    // Invalidate query
    invalidate: () => queryStore.invalidate(queryKey),
    
    // Subscribe to data changes
    subscribe: (callback: (data: T | undefined) => void) => 
      queryStore.subscribe(queryKey, callback),
    
    // Hook for reactive data access
    useQuery: (config: Omit<QueryConfig<T>, 'queryKey'>) => 
      queryStore.useQueryData({ ...config, queryKey }),
    
    // Hook for subscribing to data
    useSubscribe: () => queryStore.useSubscribe<T>(queryKey),
  };
}
