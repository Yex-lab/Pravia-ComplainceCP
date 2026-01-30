import type { TrendDirection } from './types';

// ----------------------------------------------------------------------

/**
 * Format number with commas
 */
export function formatNumber(value: string | number): string {
  if (typeof value === 'string') return value;
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format percentage
 */
export function formatPercent(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return `${numValue > 0 ? '+' : ''}${numValue}%`;
}

/**
 * Get trend direction from value
 */
export function getTrendDirection(value: string | number): TrendDirection {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (numValue > 0) return 'up';
  if (numValue < 0) return 'down';
  return 'neutral';
}

/**
 * Get trend icon based on direction
 */
export function getTrendIcon(direction: TrendDirection): string {
  switch (direction) {
    case 'up':
      return 'solar:arrow-up-bold';
    case 'down':
      return 'solar:arrow-down-bold';
    case 'neutral':
      return 'solar:minus-circle-bold';
    default:
      return 'solar:minus-circle-bold';
  }
}

/**
 * Get trend color based on direction
 */
export function getTrendColor(direction: TrendDirection, theme: any): string {
  switch (direction) {
    case 'up':
      return theme.palette.success.main;
    case 'down':
      return theme.palette.error.main;
    case 'neutral':
      return theme.palette.text.secondary;
    default:
      return theme.palette.text.secondary;
  }
}
