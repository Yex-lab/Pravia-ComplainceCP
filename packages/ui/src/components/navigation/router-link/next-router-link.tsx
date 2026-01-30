import type { ReactNode } from 'react';

// ----------------------------------------------------------------------

interface NextRouterLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Next.js router link wrapper
 * Uses Next.js Link component for client-side navigation
 */
export function NextRouterLink({ href, children, ...props }: NextRouterLinkProps) {
  const NextLink = require('next/link').default;
  return (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  );
}
