'use client';

import type { StatCardColor, StatCardLayout, StatCardSize } from './types';

import { styled, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

import { statCardClasses } from './classes';

// ----------------------------------------------------------------------

export const StatCardRoot = styled(Card, {
  shouldForwardProp: (prop: string) =>
    !['color', 'layout', 'size', 'clickable', 'borderPosition', 'borderOpacity', 'borderVisible', 'sx'].includes(prop),
})<{
  color?: StatCardColor;
  layout?: StatCardLayout;
  size?: StatCardSize;
  clickable?: boolean;
  borderPosition?: 'top' | 'bottom';
  borderOpacity?: number;
  borderVisible?: boolean;
}>(
  ({ theme, color = 'default', layout = 'icon-left', size = 'medium', clickable, borderPosition = 'bottom', borderOpacity = 0.5, borderVisible = true }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: layout === 'icon-top' ? 'column' : 'row',
    alignItems: layout === 'icon-top' ? 'flex-start' : 'center',
    gap: theme.spacing(2),
    position: 'relative',
    overflow: 'hidden',
    transition: theme.transitions.create(['box-shadow', 'border-color'], {
      duration: theme.transitions.duration.shorter,
    }),
    ...(clickable && {
      cursor: 'pointer',
      '&:hover': {
        boxShadow: theme.shadows[8],
      },
    }),
    ...(size === 'small' && {
      padding: theme.spacing(2),
    }),
    ...(size === 'large' && {
      padding: theme.spacing(4),
    }),
    // Color accent border
    ...(color !== 'default' && borderVisible && {
      [borderPosition === 'top' ? 'borderTop' : 'borderBottom']: `3px solid ${alpha(theme.palette[color].main, borderOpacity)}`,
      '&:hover': {
        [borderPosition === 'top' ? 'borderTopColor' : 'borderBottomColor']: theme.palette[color].main,
        ...(clickable && {
          boxShadow: theme.shadows[8],
        }),
      },
    }),
  })
);

export const StatCardContent = styled(Box, {
  shouldForwardProp: (prop: string) => !['layout', 'sx'].includes(prop),
})<{ layout?: StatCardLayout }>(({ layout }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  order: layout === 'icon-right' ? 1 : 2,
}));

export const StatCardIconWrapper = styled(Box, {
  shouldForwardProp: (prop: string) => !['color', 'bgColor', 'size', 'layout', 'sx'].includes(prop),
})<{
  color?: StatCardColor;
  bgColor?: string;
  size?: StatCardSize;
  layout?: StatCardLayout;
}>(({ theme, color = 'default', bgColor, size = 'medium', layout }) => {
  const iconSize = size === 'small' ? 48 : size === 'large' ? 72 : 60;
  const iconPadding = size === 'small' ? 1.5 : size === 'large' ? 2.5 : 2;

  const backgroundColor =
    bgColor ||
    (color === 'default'
      ? alpha(theme.palette.grey[500], 0.12)
      : alpha(theme.palette[color].main, 0.12));

  const iconColor =
    color === 'default' ? theme.vars.palette.text.secondary : theme.palette[color].main;

  return {
    width: iconSize,
    height: iconSize,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor,
    color: iconColor,
    order: layout === 'icon-right' ? 2 : 1,
    ...(layout === 'icon-top' && {
      marginBottom: theme.spacing(1),
    }),
  };
});

export const StatCardValue = styled(Box, {
  shouldForwardProp: (prop: string) => !['size', 'sx'].includes(prop),
})<{ size?: StatCardSize }>(({ theme, size = 'medium' }) => ({
  fontSize: size === 'small' ? theme.typography.h5.fontSize : size === 'large' ? '2.5rem' : theme.typography.h4.fontSize,
  fontWeight: theme.typography.fontWeightBold,
  lineHeight: 1.2,
  color: theme.vars.palette.text.primary,
}));

export const StatCardLabel = styled(Box, {
  shouldForwardProp: (prop: string) => !['size', 'sx'].includes(prop),
})<{ size?: StatCardSize }>(({ theme, size = 'medium' }) => ({
  fontSize: size === 'small' ? theme.typography.caption.fontSize : size === 'large' ? theme.typography.body1.fontSize : theme.typography.body2.fontSize,
  color: theme.vars.palette.text.secondary,
  fontWeight: theme.typography.fontWeightMedium,
}));

export const StatCardTrend = styled(Box, {
  shouldForwardProp: (prop: string) => !['trendColor', 'sx'].includes(prop),
})<{ trendColor?: string }>(({ theme, trendColor }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  // Icon color only
  '& .stat-card__trend-icon': {
    color: trendColor || theme.vars.palette.text.secondary,
  },
}));

export const StatCardTrendValue = styled('span', {
  shouldForwardProp: (prop: string) => !['size', 'sx'].includes(prop),
})<{ size?: StatCardSize }>(({ theme, size = 'medium' }) => ({
  fontSize: size === 'small' ? theme.typography.caption.fontSize : theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightBold,
  color: theme.vars.palette.text.primary,
}));

export const StatCardTrendLabel = styled('span', {
  shouldForwardProp: (prop: string) => !['size', 'sx'].includes(prop),
})<{ size?: StatCardSize }>(({ theme, size = 'medium' }) => ({
  fontSize: size === 'small' ? '0.65rem' : theme.typography.caption.fontSize,
  color: theme.vars.palette.text.secondary,
  opacity: 0.72,
}));

export const StatCardChart = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginLeft: theme.spacing(-1),
  marginRight: theme.spacing(-1),
  marginBottom: theme.spacing(-2),
  height: 60,
}));
