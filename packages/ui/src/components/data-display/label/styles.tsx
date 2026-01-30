'use client';

import type { LabelVariant } from './types';

import { styled, alpha } from '@mui/material/styles';

import { colorKeys } from '../../../theme/core';

// ----------------------------------------------------------------------

// Helper function to safely access theme colors with fallback
const getColor = (theme: any, colorKey: string, shade?: string) => {
  // For CSS variable themes
  if (theme.vars?.palette) {
    if (colorKey === 'default') return undefined;
    if (shade) {
      return theme.vars.palette[colorKey]?.[shade] || theme.palette[colorKey]?.[shade];
    }
    return theme.vars.palette[colorKey] || theme.palette[colorKey];
  }
  // For standard themes
  if (shade) {
    return theme.palette[colorKey]?.[shade];
  }
  return theme.palette[colorKey];
};

export const LabelRoot = styled('span', {
  shouldForwardProp: (prop: string) => !['color', 'variant', 'disabled', 'sx'].includes(prop),
})<{ variant?: LabelVariant; disabled?: boolean }>(({ theme }) => {
  if (!theme || !theme.palette) {
    return {
      height: 24,
      minWidth: 24,
      flexShrink: 0,
      lineHeight: 18 / 12,
      display: 'inline-flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
    };
  }

  return ({
  height: 24,
  minWidth: 24,
  flexShrink: 0,
  lineHeight: 18 / 12,
  cursor: 'default',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  gap: theme.spacing(0.75),
  justifyContent: 'center',
  padding: theme.spacing(0, 0.75),
  fontSize: theme.typography.pxToRem(12),
  fontWeight: theme.typography.fontWeightBold,
  borderRadius: Number(theme.shape.borderRadius) * 0.75,
  transition: theme.transitions.create(['background-color', 'color'], {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    /**
     * @variant filled
     */
    {
      props: { variant: 'filled', color: 'default' },
      style: {
        color: theme.palette.grey[800],
        backgroundColor: theme.palette.grey[300],
      },
    },
    ...colorKeys.common.map((colorKey) => ({
      props: { variant: 'filled', color: colorKey },
      style: {
        color: colorKey === 'white' ? theme.palette.common.black : theme.palette.common.white,
        backgroundColor: getColor(theme, colorKey) || (theme.palette.common && theme.palette.common[colorKey]),
      },
    })),
    ...colorKeys.palette.map((colorKey) => ({
      props: { variant: 'filled', color: colorKey },
      style: {
        color: theme.palette[colorKey].contrastText,
        backgroundColor: theme.palette[colorKey].main,
      },
    })),
    /**
     * @variant outlined
     */
    {
      props: { variant: 'outlined' },
      style: {
        border: '2px solid currentColor',
        backgroundColor: 'transparent',
      },
    },
    ...colorKeys.common.map((colorKey) => ({
      props: { variant: 'outlined', color: colorKey },
      style: {
        color: theme.palette.common[colorKey],
      },
    })),
    ...colorKeys.palette.map((colorKey) => ({
      props: { variant: 'outlined', color: colorKey },
      style: {
        color: theme.palette[colorKey].main,
      },
    })),
    /**
     * @variant soft
     */
    {
      props: { variant: 'soft', color: 'default' },
      style: {
        color: theme.palette.grey[800],
        backgroundColor: theme.palette.grey[300],
      },
    },
    ...colorKeys.common.map((colorKey) => ({
      props: { variant: 'soft', color: colorKey },
      style: {
        color: theme.palette.common[colorKey],
        backgroundColor: alpha(theme.palette.common[colorKey], 0.16),
      },
    })),
    ...colorKeys.palette.map((colorKey) => ({
      props: { variant: 'soft', color: colorKey },
      style: {
        color: theme.palette[colorKey].dark,
        backgroundColor: alpha(theme.palette[colorKey].main, 0.16),
      },
    })),
    /**
     * @variant inverted
     */
    {
      props: { variant: 'inverted', color: 'default' },
      style: {
        color: theme.palette.grey[800],
        backgroundColor: theme.palette.grey[300],
      },
    },
    ...colorKeys.common.map((colorKey) => ({
      props: { variant: 'inverted', color: colorKey },
      style: {
        color: theme.palette.common[colorKey],
        backgroundColor: alpha(theme.palette.common[colorKey], 0.08),
      },
    })),
    ...colorKeys.palette.map((colorKey) => ({
      props: { variant: 'inverted', color: colorKey },
      style: {
        color: theme.palette[colorKey].darker || theme.palette[colorKey].dark,
        backgroundColor: theme.palette[colorKey].lighter || alpha(theme.palette[colorKey].light, 0.24),
      },
    })),
    /**
     * @disabled
     */
    {
      props: { disabled: true },
      style: {
        opacity: 0.48,
        pointerEvents: 'none',
      },
    },
  ],
  });
});

export const LabelIcon = styled('span')({
  width: 16,
  height: 16,
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg, & img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});
