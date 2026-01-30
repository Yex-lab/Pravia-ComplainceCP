'use client';

import { useSearchParams as useNextSearchParams } from './next/use-search-params';
import { useSearchParams as useViteSearchParams } from './vite/use-search-params';

export function useSearchParams() {
  const isNextJS = typeof window !== 'undefined' && 'next' in window;
  
  if (isNextJS) {
    return useNextSearchParams();
  }
  
  return useViteSearchParams();
}
