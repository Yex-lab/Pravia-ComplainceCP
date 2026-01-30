'use client';

import { usePathname as useNextPathname } from './next/use-pathname';
import { usePathname as useVitePathname } from './vite/use-pathname';

export function usePathname(): string {
  const isNextJS = typeof window !== 'undefined' && 'next' in window;
  
  if (isNextJS) {
    return useNextPathname();
  }
  
  return useVitePathname();
}
