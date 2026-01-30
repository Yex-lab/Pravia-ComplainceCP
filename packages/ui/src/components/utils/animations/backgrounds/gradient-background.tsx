'use client';

import type { BoxProps } from '@mui/material/Box';
import type { Theme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';

interface GradientBackgroundProps extends BoxProps {
  variant?: 'hero' | 'section' | 'minimal';
  animated?: boolean;
}

export function GradientBackground({ 
  children, 
  variant = 'hero', 
  animated = true,
  sx,
  ...other 
}: GradientBackgroundProps) {
  const { mode } = useColorScheme() || { mode: 'light' };

  const getBackgroundStyles = () => {
    const baseStyles = {
      position: 'relative',
      overflow: 'hidden',
    };

    const variantStyles = {
      hero: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: mode === 'dark'
          ? (theme: Theme) => `
              radial-gradient(ellipse 80% 50% at 20% 40%, ${theme.palette.primary.dark}90 0%, transparent 50%),
              radial-gradient(ellipse 60% 80% at 80% 30%, ${theme.palette.secondary.dark}85 0%, transparent 50%),
              radial-gradient(ellipse 100% 60% at 40% 80%, ${theme.palette.primary.dark}75 0%, transparent 50%),
              radial-gradient(ellipse 70% 90% at 90% 70%, ${theme.palette.secondary.dark}80 0%, transparent 50%),
              radial-gradient(ellipse 120% 40% at 10% 90%, ${theme.palette.primary.dark}70 0%, transparent 50%),
              linear-gradient(135deg, #000000 0%, #0a0a0a 100%)
            `
          : (theme: Theme) => `
              radial-gradient(ellipse 80% 50% at 20% 40%, ${theme.palette.primary.light}65 0%, transparent 50%),
              radial-gradient(ellipse 60% 80% at 80% 30%, ${theme.palette.secondary.light}60 0%, transparent 50%),
              radial-gradient(ellipse 100% 60% at 40% 80%, ${theme.palette.primary.light}55 0%, transparent 50%),
              radial-gradient(ellipse 70% 90% at 90% 70%, ${theme.palette.secondary.light}58 0%, transparent 50%),
              radial-gradient(ellipse 120% 40% at 10% 90%, ${theme.palette.primary.light}50 0%, transparent 50%),
              linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)
            `,
      },
      section: {
        py: 10,
        bgcolor: mode === 'dark' ? '#0a0a0a' : 'background.neutral',
      },
      minimal: {
        background: mode === 'dark'
          ? (theme: Theme) => `linear-gradient(135deg, ${theme.palette.primary.dark}20 0%, transparent 50%)`
          : (theme: Theme) => `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, transparent 50%)`,
      },
    };

    const animatedOverlay = animated ? {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: mode === 'dark'
          ? (theme: Theme) => `
              radial-gradient(ellipse 90% 70% at 60% 20%, ${theme.palette.primary.main}25 0%, transparent 40%),
              radial-gradient(ellipse 70% 100% at 30% 60%, ${theme.palette.secondary.main}20 0%, transparent 40%),
              radial-gradient(ellipse 110% 50% at 80% 80%, ${theme.palette.primary.main}18 0%, transparent 40%)
            `
          : (theme: Theme) => `
              radial-gradient(ellipse 90% 70% at 60% 20%, ${theme.palette.primary.main}15 0%, transparent 40%),
              radial-gradient(ellipse 70% 100% at 30% 60%, ${theme.palette.secondary.main}12 0%, transparent 40%),
              radial-gradient(ellipse 110% 50% at 80% 80%, ${theme.palette.primary.main}10 0%, transparent 40%)
            `,
        backgroundSize: '400% 400%, 300% 300%, 500% 500%',
        animation: 'freeformShift 25s ease infinite',
        zIndex: 0,
      },
      '@keyframes freeformShift': {
        '0%': { backgroundPosition: '0% 50%, 100% 0%, 50% 100%' },
        '33%': { backgroundPosition: '100% 20%, 0% 100%, 0% 50%' },
        '66%': { backgroundPosition: '50% 100%, 50% 50%, 100% 0%' },
        '100%': { backgroundPosition: '0% 50%, 100% 0%, 50% 100%' },
      },
    } : {};

    return {
      ...baseStyles,
      ...variantStyles[variant],
      ...(variant === 'hero' && animated ? animatedOverlay : {}),
    };
  };

  return (
    <Box sx={[getBackgroundStyles(), ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {children}
    </Box>
  );
}
