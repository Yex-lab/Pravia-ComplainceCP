import type { StatCardProps } from './types';

import { lazy, Suspense } from 'react';
import { useTheme } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

import { mergeClasses } from '../../../utils/merge-classes';
import { Iconify } from '../iconify';
import { statCardClasses } from './classes';
import { formatNumber, formatPercent, getTrendDirection, getTrendIcon, getTrendColor } from './utils';
import {
  StatCardRoot,
  StatCardContent,
  StatCardIconWrapper,
  StatCardValue,
  StatCardLabel,
  StatCardTrend,
  StatCardTrendValue,
  StatCardTrendLabel,
  StatCardChart,
} from './styles';

// Dynamic import for ApexCharts using React.lazy
const Chart = lazy(() => import('react-apexcharts'));

// ----------------------------------------------------------------------

export function StatCard({
  value,
  label,
  icon,
  color = 'default',
  layout = 'icon-left',
  size = 'medium',
  borderPosition = 'bottom',
  borderOpacity = 0.5,
  borderVisible = true,
  trend,
  chart,
  loading,
  customIcon,
  iconBackgroundColor,
  iconColor,
  formatValue,
  onClick,
  className,
  sx,
  ...other
}: StatCardProps) {
  const theme = useTheme();

  // Format the value
  const formattedValue = formatValue ? formatValue(value) : formatNumber(value);

  // Determine trend direction if not provided
  const trendDirection = trend?.direction || (trend ? getTrendDirection(trend.value) : undefined);

  // Get trend color
  const trendColor =
    trend?.color || (trendDirection ? getTrendColor(trendDirection, theme) : undefined);

  // Render icon
  const renderIcon = () => {
    if (customIcon) return customIcon;
    if (!icon) return null;

    return (
      <Iconify
        icon={icon as any}
        width={size === 'small' ? 24 : size === 'large' ? 36 : 28}
        className={statCardClasses.icon}
      />
    );
  };

  // Render trend
  const renderTrend = () => {
    if (!trend) return null;

    const trendValue =
      typeof trend.value === 'string' ? trend.value : formatPercent(trend.value);

    return (
      <StatCardTrend trendColor={trendColor} className={statCardClasses.trend}>
        {trend.showIcon !== false && trendDirection && (
          <Iconify
            icon={getTrendIcon(trendDirection) as any}
            width={size === 'small' ? 14 : 16}
            className={statCardClasses.trendIcon}
          />
        )}
        <StatCardTrendValue size={size} className={statCardClasses.trendValue}>
          {trendValue}
        </StatCardTrendValue>
        {trend.label && (
          <StatCardTrendLabel size={size} className={statCardClasses.trendLabel}>
            {trend.label}
          </StatCardTrendLabel>
        )}
      </StatCardTrend>
    );
  };

  // Render chart
  const renderChart = () => {
    if (!chart || typeof window === 'undefined') return null;

    const chartColor = color === 'default' ? theme.palette.primary.main : theme.palette[color].main;

    const defaultOptions: ApexCharts.ApexOptions = {
      chart: {
        type: 'area',
        sparkline: { enabled: true },
        toolbar: { show: false },
        animations: { enabled: true },
      },
      stroke: {
        width: 2,
        curve: 'smooth',
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [0, 100],
        },
      },
      colors: [chartColor],
      tooltip: {
        enabled: true,
        x: { show: false },
        y: {
          formatter: (val: number) => formatNumber(val),
        },
        marker: { show: false },
      },
      xaxis: {
        categories: chart.categories,
      },
    };

    const mergedOptions = {
      ...defaultOptions,
      ...chart.options,
    };

    return (
      <StatCardChart className={statCardClasses.chart}>
        <Suspense fallback={<div />}>
          <Chart
            type="area"
            series={[{ name: label, data: chart.data }]}
            options={mergedOptions}
            height="100%"
            width="100%"
          />
        </Suspense>
      </StatCardChart>
    );
  };

  return (
    <StatCardRoot
      color={color}
      layout={layout}
      size={size}
      borderPosition={borderPosition}
      borderOpacity={borderOpacity}
      borderVisible={borderVisible}
      clickable={!!onClick}
      onClick={onClick}
      className={mergeClasses([statCardClasses.root, className])}
      sx={sx}
      {...other}
    >
      {(icon || customIcon) && (
        <StatCardIconWrapper
          color={color}
          bgColor={iconBackgroundColor}
          size={size}
          layout={layout}
          className={statCardClasses.iconWrapper}
          sx={iconColor ? { color: iconColor } : undefined}
        >
          {renderIcon()}
        </StatCardIconWrapper>
      )}

      <StatCardContent layout={layout} className={statCardClasses.content}>
        <StatCardValue size={size} className={statCardClasses.value}>
          {loading ? (
            <Skeleton 
              variant="text" 
              width="80%" 
              height={size === 'small' ? 28 : size === 'large' ? 40 : 32}
              sx={{ bgcolor: 'action.hover' }}
            />
          ) : (
            formattedValue
          )}
        </StatCardValue>
        <StatCardLabel size={size} className={statCardClasses.label}>
          {label}
        </StatCardLabel>
        {renderTrend()}
        {renderChart()}
      </StatCardContent>
    </StatCardRoot>
  );
}

// Skeleton component for loading state
function StatCardSkeleton({ size, layout }: { size?: 'small' | 'medium' | 'large'; layout?: 'icon-left' | 'icon-right' | 'icon-top' }) {
  const theme = useTheme();

  return (
    <StatCardRoot color="default" layout={layout} size={size}>
      <StatCardIconWrapper
        color="default"
        size={size}
        layout={layout}
        sx={{
          backgroundColor: theme.palette.action.hover,
          animation: 'pulse 1.5s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.5 },
          },
        }}
      />
      <StatCardContent layout={layout}>
        <StatCardValue
          size={size}
          sx={{
            width: 80,
            height: size === 'small' ? 24 : size === 'large' ? 36 : 28,
            backgroundColor: theme.palette.action.hover,
            borderRadius: 1,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <StatCardLabel
          size={size}
          sx={{
            width: 120,
            height: size === 'small' ? 14 : 16,
            backgroundColor: theme.palette.action.hover,
            borderRadius: 1,
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: '0.2s',
          }}
        />
      </StatCardContent>
    </StatCardRoot>
  );
}
