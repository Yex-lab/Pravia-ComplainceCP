import type { LinkProps } from 'react-router';

import { Link } from 'react-router';

// ----------------------------------------------------------------------

interface RouterLinkProps extends Omit<LinkProps, 'to'> {
  href: string;
  ref?: React.RefObject<HTMLAnchorElement | null>;
}

/**
 * Vite/React Router link wrapper
 * Uses React Router Link component for client-side navigation
 */
export function RouterLink({ href, ref, ...other }: RouterLinkProps) {
  return <Link ref={ref} to={href} {...other} />;
}
