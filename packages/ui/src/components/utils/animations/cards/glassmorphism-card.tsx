// @ts-nocheck
'use client';

import { forwardRef, useState, useEffect } from 'react';
import { m } from 'framer-motion';
import type { MotionProps } from 'framer-motion';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import type { BoxProps } from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface GlassmorphismCardProps extends Omit<BoxProps, 'component'> {
  children?: React.ReactNode;
  intensity?: 'subtle' | 'medium' | 'strong';
  hoverEffect?: 'lift' | 'tilt' | 'scale' | 'glow' | 'none';
  borderStyle?: 'solid' | 'gradient' | 'none';
  backdropBlur?: number;
  className?: string;
  motionProps?: MotionProps;
  sx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

const intensityPresets = {
  subtle: {
    dark: 'rgba(255, 255, 255, 0.05)',
    light: 'rgba(255, 255, 255, 0.1)',
    borderDark: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(0, 0, 0, 0.1)',
  },
  medium: {
    dark: 'rgba(255, 255, 255, 0.1)',
    light: 'rgba(255, 255, 255, 0.2)',
    borderDark: 'rgba(255, 255, 255, 0.2)',
    borderLight: 'rgba(0, 0, 0, 0.15)',
  },
  strong: {
    dark: 'rgba(255, 255, 255, 0.15)',
    light: 'rgba(255, 255, 255, 0.3)',
    borderDark: 'rgba(255, 255, 255, 0.3)',
    borderLight: 'rgba(0, 0, 0, 0.2)',
  },
} as const;

const hoverEffects = {
  lift: {
    whileHover: {
      y: -8,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  },
  tilt: {
    whileHover: {
      rotateX: 5,
      rotateY: 5,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  },
  scale: {
    whileHover: {
      scale: 1.02,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  },
  glow: {
    whileHover: {
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 40px rgba(59, 130, 246, 0.3)',
      transition: { duration: 0.3 },
    },
  },
  none: {},
} as const;

// ----------------------------------------------------------------------

export const GlassmorphismCard = forwardRef<HTMLDivElement, GlassmorphismCardProps>(
  (
    {
      children,
      intensity = 'medium',
      hoverEffect = 'lift',
      borderStyle = 'solid',
      backdropBlur = 20,
      className,
      motionProps = {},
      sx,
      ...other
    },
    ref
  ) => {
    // Get theme mode with hydration-safe fallback
    const { mode } = useColorScheme() || { mode: 'light' };
    const [domMode, setDomMode] = useState<string | null>(null);
    
    // Read DOM theme after hydration to prevent mismatch
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const domTheme = document.documentElement.getAttribute('data-mui-color-scheme');
        if (domTheme === 'dark' || domTheme === 'light') {
          setDomMode(domTheme);
        }
      }
    }, []);
    
    // Use DOM mode if available and React context mode is undefined, otherwise use React context mode
    const resolvedMode = mode || domMode || 'light';
    
    console.log('GlassmorphismCard rendering:', { mode, domMode, resolvedMode, intensity });
    
    const preset = intensityPresets[intensity];

    const getBorderStyle = () => {
      if (borderStyle === 'none') return 'none';
      
      if (borderStyle === 'gradient') {
        return resolvedMode === 'dark'
          ? '1px solid transparent'
          : '1px solid transparent';
      }
      
      return resolvedMode === 'dark'
        ? `1px solid ${preset.borderDark}`
        : `1px solid ${preset.borderLight}`;
    };

    const getGradientBorder = () => {
      if (borderStyle !== 'gradient') return {};
      
      return {
        background: resolvedMode === 'dark'
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))'
          : 'linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 1,
          borderRadius: 'inherit',
          background: resolvedMode === 'dark' ? preset.dark : preset.light,
          zIndex: -1,
        },
      };
    };

    const { ...motionCompatibleProps } = other;
    
    return (
      <m.div
        ref={ref}
        className={className}
        {...hoverEffects[hoverEffect]}
        {...motionProps}
        style={{
          position: 'relative',
          borderRadius: '8px',
          background: resolvedMode === 'dark' ? preset.dark : preset.light,
          backdropFilter: `blur(${backdropBlur}px)`,
          WebkitBackdropFilter: `blur(${backdropBlur}px)`,
          border: getBorderStyle(),
          boxShadow: resolvedMode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          overflow: 'hidden',
          ...getGradientBorder(),
        }}
      >
        {children}
      </m.div>
    );
  }
);

GlassmorphismCard.displayName = 'GlassmorphismCard';

// ----------------------------------------------------------------------
// Preset components for easy use

export function SubtleGlassCard(props: Omit<GlassmorphismCardProps, 'intensity'>) {
  return <GlassmorphismCard intensity="subtle" {...props} />;
}

export function MediumGlassCard(props: Omit<GlassmorphismCardProps, 'intensity'>) {
  return <GlassmorphismCard intensity="medium" {...props} />;
}

export function StrongGlassCard(props: Omit<GlassmorphismCardProps, 'intensity'>) {
  return <GlassmorphismCard intensity="strong" {...props} />;
}

// Specific hover effect variants
export function LiftGlassCard(props: Omit<GlassmorphismCardProps, 'hoverEffect'>) {
  return <GlassmorphismCard hoverEffect="lift" {...props} />;
}

export function TiltGlassCard(props: Omit<GlassmorphismCardProps, 'hoverEffect'>) {
  return <GlassmorphismCard hoverEffect="tilt" {...props} />;
}

export function ScaleGlassCard(props: Omit<GlassmorphismCardProps, 'hoverEffect'>) {
  return <GlassmorphismCard hoverEffect="scale" {...props} />;
}

export function GlowGlassCard(props: Omit<GlassmorphismCardProps, 'hoverEffect'>) {
  return <GlassmorphismCard hoverEffect="glow" {...props} />;
}

// ----------------------------------------------------------------------
// Usage examples and presets

export const glassmorphismPresets = {
  // Feature cards
  featureCard: {
    intensity: 'medium' as const,
    hoverEffect: 'lift' as const,
    borderStyle: 'solid' as const,
    backdropBlur: 20,
    sx: { p: 3, height: '100%' },
  },
  
  // Testimonial cards
  testimonialCard: {
    intensity: 'subtle' as const,
    hoverEffect: 'tilt' as const,
    borderStyle: 'gradient' as const,
    backdropBlur: 15,
    sx: { p: 4, maxWidth: 400 },
  },
  
  // CTA cards
  ctaCard: {
    intensity: 'strong' as const,
    hoverEffect: 'glow' as const,
    borderStyle: 'gradient' as const,
    backdropBlur: 25,
    sx: { p: 4, textAlign: 'center' },
  },
  
  // Stats cards
  statsCard: {
    intensity: 'medium' as const,
    hoverEffect: 'scale' as const,
    borderStyle: 'solid' as const,
    backdropBlur: 18,
    sx: { p: 3, textAlign: 'center', minHeight: 120 },
  },
  
  // Navigation cards
  navCard: {
    intensity: 'subtle' as const,
    hoverEffect: 'lift' as const,
    borderStyle: 'none' as const,
    backdropBlur: 12,
    sx: { p: 2, cursor: 'pointer' },
  },
} as const;

// ----------------------------------------------------------------------
// Easy preset components

export function FeatureGlassCard(props: Omit<GlassmorphismCardProps, keyof typeof glassmorphismPresets.featureCard>) {
  return <GlassmorphismCard {...glassmorphismPresets.featureCard} {...props} />;
}

export function TestimonialGlassCard(props: Omit<GlassmorphismCardProps, keyof typeof glassmorphismPresets.testimonialCard>) {
  return <GlassmorphismCard {...glassmorphismPresets.testimonialCard} {...props} />;
}

export function CtaGlassCard(props: Omit<GlassmorphismCardProps, keyof typeof glassmorphismPresets.ctaCard>) {
  return <GlassmorphismCard {...glassmorphismPresets.ctaCard} {...props} />;
}

export function StatsGlassCard(props: Omit<GlassmorphismCardProps, keyof typeof glassmorphismPresets.statsCard>) {
  return <GlassmorphismCard {...glassmorphismPresets.statsCard} {...props} />;
}

export function NavGlassCard(props: Omit<GlassmorphismCardProps, keyof typeof glassmorphismPresets.navCard>) {
  return <GlassmorphismCard {...glassmorphismPresets.navCard} {...props} />;
}
