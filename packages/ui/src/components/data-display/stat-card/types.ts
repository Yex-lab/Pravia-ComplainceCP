import type { SxProps, Theme } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';
import type { StatCardRoot } from './styles';
import type { PaletteColorKey } from '../../../theme/core';

// ----------------------------------------------------------------------

export type StatCardColor = PaletteColorKey | 'default';

export type StatCardLayout = 'icon-left' | 'icon-right' | 'icon-top';

export type StatCardSize = 'small' | 'medium' | 'large';

export type StatCardBorderPosition = 'top' | 'bottom';

export type TrendDirection = 'up' | 'down' | 'neutral';

export type TrendData = {
  value: string | number;
  direction?: TrendDirection;
  label?: string;
  showIcon?: boolean;
  color?: string;
};

export type ChartData = {
  data: number[];
  categories?: string[];
  options?: Partial<ApexOptions>;
};

export interface StatCardProps extends Omit<React.ComponentProps<typeof StatCardRoot>, 'color'> {
  value: string | number;
  label: string;
  icon?: string;
  color?: StatCardColor;
  layout?: StatCardLayout;
  size?: StatCardSize;
  borderPosition?: StatCardBorderPosition;
  borderOpacity?: number;
  borderVisible?: boolean;
  trend?: TrendData;
  chart?: ChartData;
  loading?: boolean;
  customIcon?: React.ReactNode;
  iconBackgroundColor?: string;
  iconColor?: string;
  formatValue?: (value: string | number) => string;
  onClick?: () => void;
  sx?: SxProps<Theme>;
  className?: string;
}
