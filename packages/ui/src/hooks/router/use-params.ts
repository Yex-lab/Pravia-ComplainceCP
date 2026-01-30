'use client';

import { useParams as useNextParams } from './next/use-params';
import { useParams as useViteParams } from './vite/use-params';

export function useParams<T = any>(): T {
  const isNextJS = typeof window !== 'undefined' && 'next' in window;
  
  if (isNextJS) {
    return useNextParams() as T;
  }
  
  return useViteParams() as T;
}
