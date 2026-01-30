'use client';

import type { ReactNode } from 'react';

import { NextRouterLink } from './next-router-link';
import { RouterLink } from './vite-router-link';

// ----------------------------------------------------------------------

export interface CommonRouterLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Common router link component that adapts to the environment
 * - Uses NextRouterLink for Next.js applications
 * - Uses RouterLink (React Router) for Vite applications
 */
export function CommonRouterLink({ href, children, ...props }: CommonRouterLinkProps) {
  const isNextJS = typeof window !== 'undefined' && 'next' in window;
  
  if (isNextJS) {
    return (
      <NextRouterLink href={href} {...props}>
        {children}
      </NextRouterLink>
    );
  }
  
  return (
    <RouterLink href={href} {...props}>
      {children}
    </RouterLink>
  );
}
