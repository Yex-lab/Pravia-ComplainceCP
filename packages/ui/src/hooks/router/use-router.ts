'use client';

import { useRouter as useNextRouter } from './next/use-router';
import { useRouter as useViteRouter } from './vite/use-router';

export function useRouter() {
  const isNextJS = typeof window !== 'undefined' && 'next' in window;
  
  if (isNextJS) {
    return useNextRouter();
  }
  
  return useViteRouter();
}
