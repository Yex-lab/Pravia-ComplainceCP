import type { BoxProps } from '@mui/material/Box';

import { Logo, type FontConfig } from './logo';

// ----------------------------------------------------------------------

/**
 * BrandLogo component displays the Pravia CRM brand identity with:
 * - Pravia logo icon
 * - "Pravia CRM" title
 * - "OIS Compliance with AI" subtitle with animated gradient on "with AI"
 * 
 * @example
 * ```tsx
 * // Full logo with text (expanded state)
 * <BrandLogo />
 * 
 * // Icon only (collapsed/mini state)
 * <BrandLogo isSingle />
 * 
 * // Custom font configuration
 * <BrandLogo 
 *   titleFont={{ weight: 800, size: '1.5rem' }}
 *   subtitleFont={{ weight: 600 }}
 * />
 * 
 * // With React Router Link
 * <BrandLogo LinkComponent={RouterLink} href="/dashboard" />
 * ```
 */

export type BrandLogoProps = BoxProps & {
  /**
   * If true, shows only the Pravia icon without text.
   * Useful for collapsed/mini navigation states.
   * @default false
   */
  isSingle?: boolean;
  
  /**
   * Width of the logo in pixels
   * @default undefined (auto-sized based on isSingle)
   */
  width?: number;
  
  /**
   * Height of the logo in pixels
   * @default undefined (auto-sized based on isSingle)
   */
  height?: number;
  
  /**
   * URL to navigate to when logo is clicked
   * @default '/'
   */
  href?: string;
  
  /**
   * If true, logo will not be clickable
   * @default false
   */
  disableLink?: boolean;
  
  /**
   * Custom Link component for client-side navigation (e.g., React Router Link)
   * Prevents full page refreshes on navigation
   * @default Next.js Link
   */
  LinkComponent?: React.ElementType;
  
  /**
   * Font configuration for "Pravia CRM" title
   * @default { family: 'Inter', weight: 700, size: '1.25rem' }
   */
  titleFont?: FontConfig;
  
  /**
   * Font configuration for "OIS Compliance with AI" subtitle
   * @default { family: 'Inter', weight: 500, size: '0.75rem' }
   */
  subtitleFont?: FontConfig;

  subtitle?: string;
};

/**
 * BrandLogo - Displays the Pravia CRM brand identity
 * 
 * This component provides a consistent brand representation across the application,
 * featuring the Pravia logo with configurable text and styling. The subtitle includes
 * an animated gradient effect on "with AI" text.
 * 
 * The component automatically adapts between full (with text) and mini (icon only) states
 * based on the `isSingle` prop, making it ideal for responsive navigation layouts.
 */
export function BrandLogo({
  isSingle = false,
  width,
  height,
  href = '/',
  disableLink = false,
  LinkComponent,
  title,
  subtitle,
  titleFont,
  subtitleFont,
  sx,
  ...other
}: BrandLogoProps) {
  return (
    <Logo
      isSingle={isSingle}
      width={width}
      height={height}
      href={href}
      disableLink={disableLink}
      LinkComponent={LinkComponent}
      title={title || "Pravia Mule"}
      subtitle={subtitle || "OIS Compliance"}
      titleFont={{
        family: "'Inter', sans-serif",
        weight: 700,
        size: '1.25rem',
        ...titleFont,
      }}
      subtitleFont={{
        family: "'Inter', sans-serif",
        weight: 500,
        size: '0.75rem',
        ...subtitleFont,
      }}
      sx={sx}
      {...other}
    />
  );
}
