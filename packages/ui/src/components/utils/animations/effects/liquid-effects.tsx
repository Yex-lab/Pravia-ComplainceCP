'use client';

import type { BoxProps } from '@mui/material/Box';
import type { ButtonProps } from '@mui/material/Button';
import type { SxProps, Theme } from '@mui/material/styles';

import { useState, useRef, useEffect, useCallback } from 'react';
import { m, useAnimation, useMotionValue, useSpring } from 'framer-motion';
import { useColorScheme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

interface LiquidEffectProps extends Omit<BoxProps, 'children'> {
  /** Liquid animation preset */
  preset?: 'wave' | 'blob' | 'ripple' | 'flow' | 'pulse' | 'morph';
  /** Animation speed multiplier */
  speed?: number;
  /** Liquid colors (will use theme colors if not provided) */
  colors?: string[];
  /** Effect intensity */
  intensity?: 'subtle' | 'medium' | 'strong';
  /** Enable mouse interaction */
  interactive?: boolean;
  /** Liquid viscosity (affects animation smoothness) */
  viscosity?: number;
  /** Enable glow effect */
  enableGlow?: boolean;
  /** Custom size */
  size?: number | string;
  /** Children to render inside liquid container */
  children?: React.ReactNode;
}

interface LiquidButtonProps extends Omit<ButtonProps, 'variant'> {
  /** Liquid button variant */
  variant?: 'liquid' | 'liquidOutlined' | 'liquidGlow';
  /** Liquid animation speed */
  liquidSpeed?: number;
  /** Enable ripple effect on click */
  enableRipple?: boolean;
}

// ----------------------------------------------------------------------
// SVG Filter definitions for liquid effects

const LiquidFilters = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      {/* Gooey/Liquid filter */}
      <filter id="liquid-gooey" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          result="gooey"
        />
        <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
      </filter>

      {/* Liquid glow filter */}
      <filter id="liquid-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Turbulence for organic movement */}
      <filter id="liquid-turbulence" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence
          baseFrequency="0.02"
          numOctaves="3"
          result="noise"
          seed="1"
        >
          <animate
            attributeName="baseFrequency"
            dur="20s"
            values="0.02;0.005;0.02"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
      </filter>

      {/* Liquid wave pattern */}
      <pattern id="liquid-wave" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M0,10 Q25,0 50,10 T100,10 V20 H0 Z"
          fill="currentColor"
          opacity="0.3"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            dur="3s"
            values="0,0;-100,0;0,0"
            repeatCount="indefinite"
          />
        </path>
      </pattern>
    </defs>
  </svg>
);

// ----------------------------------------------------------------------

export function LiquidEffect({
  preset = 'blob',
  speed = 1,
  colors,
  intensity = 'medium',
  interactive = true,
  viscosity = 1,
  enableGlow = true,
  size = '100%',
  children,
  sx,
  ...other
}: LiquidEffectProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  const { mode } = useColorScheme() || { mode: 'light' };
  const theme = useTheme();

  // Get theme-appropriate colors
  const getLiquidColors = useCallback(() => {
    if (colors) return colors;
    
    // Use actual theme colors
    return [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.primary.light,
      theme.palette.secondary.light,
    ];
  }, [colors, theme]);

  const liquidColors = getLiquidColors();

  // Handle mouse movement for interactive effects
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  }, [interactive]);

  // Animation variants based on preset
  const getAnimationVariants = () => {
    const baseSpeed = 2 / speed;
    const intensityMultiplier = intensity === 'subtle' ? 0.5 : intensity === 'strong' ? 1.5 : 1;

    switch (preset) {
      case 'wave':
        return {
          animate: {
            y: [0, -10, 0],
            transition: {
              duration: baseSpeed * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
        };
      
      case 'blob':
        return {
          animate: {
            borderRadius: [
              '60% 40% 30% 70%/60% 30% 70% 40%',
              '30% 60% 70% 40%/50% 60% 30% 60%',
              '60% 40% 30% 70%/60% 30% 70% 40%',
            ],
            transition: {
              duration: baseSpeed * 4,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
        };
      
      case 'ripple':
        return {
          animate: {
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
            transition: {
              duration: baseSpeed * 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
        };
      
      case 'flow':
        return {
          animate: {
            background: [
              `linear-gradient(45deg, ${liquidColors[0]}, ${liquidColors[1]})`,
              `linear-gradient(135deg, ${liquidColors[1]}, ${liquidColors[2]})`,
              `linear-gradient(225deg, ${liquidColors[2]}, ${liquidColors[0]})`,
              `linear-gradient(315deg, ${liquidColors[0]}, ${liquidColors[1]})`,
            ],
            transition: {
              duration: baseSpeed * 6,
              repeat: Infinity,
              ease: 'linear',
            },
          },
        };
      
      case 'pulse':
        return {
          animate: {
            scale: [1, 1.02, 1],
            filter: [
              'brightness(1) saturate(1)',
              'brightness(1.1) saturate(1.2)',
              'brightness(1) saturate(1)',
            ],
            transition: {
              duration: baseSpeed * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
        };
      
      case 'morph':
        return {
          animate: {
            clipPath: [
              'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              'polygon(0% 20%, 100% 0%, 100% 80%, 0% 100%)',
              'polygon(0% 0%, 100% 20%, 100% 100%, 0% 80%)',
              'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            ],
            transition: {
              duration: baseSpeed * 5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
        };
      
      default:
        return {};
    }
  };

  const variants = getAnimationVariants();

  // Interactive hover effects
  const hoverVariants = {
    hover: {
      scale: 1.02,
      filter: 'brightness(1.1)',
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <LiquidFilters />
      <Box
        ref={containerRef}
        component={m.div}
        variants={variants}
        animate="animate"
        whileHover={interactive ? "hover" : undefined}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={[
          {
            position: 'relative',
            width: size,
            height: size,
            background: preset === 'flow' 
              ? `linear-gradient(45deg, ${liquidColors[0]}, ${liquidColors[1]})`
              : liquidColors[0],
            filter: enableGlow 
              ? `url(#liquid-glow) ${preset === 'blob' ? 'url(#liquid-gooey)' : ''}`
              : preset === 'blob' ? 'url(#liquid-gooey)' : 'none',
            borderRadius: preset === 'blob' ? '60% 40% 30% 70%/60% 30% 70% 40%' : 2,
            overflow: 'hidden',
            cursor: interactive ? 'pointer' : 'default',
            // Add liquid-like box shadow
            boxShadow: mode === 'dark'
              ? `0 8px 32px ${liquidColors[0]}40, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
              : `0 8px 32px ${liquidColors[0]}30, inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {/* Interactive liquid overlay */}
        {interactive && isHovered && (
          <Box
            component={m.div}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.3, 
              scale: 1,
              x: `${mousePosition.x - 50}%`,
              y: `${mousePosition.y - 50}%`,
            }}
            exit={{ opacity: 0, scale: 0 }}
            sx={{
              position: 'absolute',
              width: 100,
              height: 100,
              background: `radial-gradient(circle, ${liquidColors[1]}80, transparent)`,
              borderRadius: '50%',
              pointerEvents: 'none',
              filter: 'blur(20px)',
            }}
          />
        )}

        {/* Liquid wave overlay for wave preset */}
        {preset === 'wave' && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '30%',
              background: 'url(#liquid-wave)',
              opacity: 0.6,
            }}
          />
        )}

        {/* Content */}
        {children && (
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
          >
            {children}
          </Box>
        )}
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------
// Liquid Button Component

export function LiquidButton({
  variant = 'liquid',
  liquidSpeed = 1,
  enableRipple = true,
  children,
  sx,
  ...other
}: LiquidButtonProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const { mode } = useColorScheme() || { mode: 'light' };
  const theme = useTheme();

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (enableRipple) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const newRipple = { id: Date.now(), x, y };
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }
    
    if (other.onClick) {
      other.onClick(event);
    }
  }, [enableRipple, other.onClick]);

  const getButtonStyles = () => {
    const baseStyles = {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 3,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
      },
    };

    switch (variant) {
      case 'liquid':
        return {
          ...baseStyles,
          background: (theme: Theme) => mode === 'dark'
            ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          filter: 'url(#liquid-glow)',
          '&:hover': {
            ...baseStyles['&:hover'],
            filter: 'url(#liquid-glow) brightness(1.1)',
            boxShadow: (theme: Theme) => mode === 'dark'
              ? `0 8px 25px ${theme.palette.primary.main}40`
              : `0 8px 25px ${theme.palette.primary.main}30`,
          },
        };
      
      case 'liquidOutlined':
        return {
          ...baseStyles,
          background: 'transparent',
          border: '2px solid',
          borderColor: (theme: Theme) => theme.palette.primary.main,
          color: (theme: Theme) => theme.palette.primary.main,
          '&:hover': {
            ...baseStyles['&:hover'],
            background: (theme: Theme) => mode === 'dark'
              ? `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`
              : `linear-gradient(45deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
            borderColor: (theme: Theme) => theme.palette.secondary.main,
            color: (theme: Theme) => theme.palette.secondary.main,
          },
        };
      
      case 'liquidGlow':
        return {
          ...baseStyles,
          background: (theme: Theme) => mode === 'dark'
            ? `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`
            : `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
          color: 'white',
          filter: 'url(#liquid-glow)',
          boxShadow: (theme: Theme) => mode === 'dark'
            ? `0 0 20px ${theme.palette.secondary.main}50`
            : `0 0 20px ${theme.palette.secondary.main}30`,
          '&:hover': {
            ...baseStyles['&:hover'],
            filter: 'url(#liquid-glow) brightness(1.2)',
            boxShadow: (theme: Theme) => mode === 'dark'
              ? `0 8px 30px ${theme.palette.secondary.main}60`
              : `0 8px 30px ${theme.palette.secondary.main}40`,
          },
        };
      
      default:
        return baseStyles;
    }
  };

  return (
    <>
      <LiquidFilters />
      <Button
        sx={[getButtonStyles(), ...(Array.isArray(sx) ? sx : [sx])]}
        onClick={handleClick}
        {...other}
      >
        {/* Liquid background animation */}
        <Box
          component={m.div}
          animate={{
            background: [
              `linear-gradient(45deg, transparent, ${theme.palette.common.white}10, transparent)`,
              `linear-gradient(135deg, transparent, ${theme.palette.common.white}10, transparent)`,
              `linear-gradient(225deg, transparent, ${theme.palette.common.white}10, transparent)`,
              `linear-gradient(315deg, transparent, ${theme.palette.common.white}10, transparent)`,
            ],
          }}
          transition={{
            duration: 3 / liquidSpeed,
            repeat: Infinity,
            ease: 'linear',
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <Box
            key={ripple.id}
            component={m.div}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            sx={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: theme.palette.common.white,
              opacity: 0.6,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Button content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {children}
        </Box>
      </Button>
    </>
  );
}

// ----------------------------------------------------------------------
// Preset components for easy use

export function WaveLiquid(props: Omit<LiquidEffectProps, 'preset'>) {
  return <LiquidEffect preset="wave" {...props} />;
}

export function BlobLiquid(props: Omit<LiquidEffectProps, 'preset'>) {
  return <LiquidEffect preset="blob" {...props} />;
}

export function RippleLiquid(props: Omit<LiquidEffectProps, 'preset'>) {
  return <LiquidEffect preset="ripple" {...props} />;
}

export function FlowLiquid(props: Omit<LiquidEffectProps, 'preset'>) {
  return <LiquidEffect preset="flow" {...props} />;
}

export function PulseLiquid(props: Omit<LiquidEffectProps, 'preset'>) {
  return <LiquidEffect preset="pulse" {...props} />;
}

export function MorphLiquid(props: Omit<LiquidEffectProps, 'preset'>) {
  return <LiquidEffect preset="morph" {...props} />;
}

// ----------------------------------------------------------------------
// Usage examples and presets

export const liquidPresetExamples = {
  // Hero section decoration
  heroLiquid: {
    preset: 'blob' as const,
    size: 300,
    intensity: 'medium' as const,
    enableGlow: true,
    interactive: true,
    sx: { opacity: 0.7 },
  },
  
  // Feature card background
  featureLiquid: {
    preset: 'flow' as const,
    size: '100%',
    intensity: 'subtle' as const,
    speed: 0.5,
    sx: { borderRadius: 2 },
  },
  
  // CTA button
  ctaButton: {
    variant: 'liquid' as const,
    size: 'large' as const,
    enableRipple: true,
    liquidSpeed: 1.5,
  },
  
  // Loading indicator
  loadingLiquid: {
    preset: 'pulse' as const,
    size: 60,
    intensity: 'strong' as const,
    speed: 2,
  },
  
  // Background element
  backgroundLiquid: {
    preset: 'morph' as const,
    size: 200,
    intensity: 'subtle' as const,
    speed: 0.3,
    sx: { position: 'absolute', opacity: 0.3 },
  },
};

// ----------------------------------------------------------------------
// Easy preset components

export function HeroLiquidEffect(props: Omit<LiquidEffectProps, keyof typeof liquidPresetExamples.heroLiquid>) {
  return <LiquidEffect {...liquidPresetExamples.heroLiquid} {...props} />;
}

export function FeatureLiquidBackground(props: Omit<LiquidEffectProps, keyof typeof liquidPresetExamples.featureLiquid>) {
  return <LiquidEffect {...liquidPresetExamples.featureLiquid} {...props} />;
}

export function CtaLiquidButton(props: Omit<LiquidButtonProps, keyof typeof liquidPresetExamples.ctaButton>) {
  return <LiquidButton {...liquidPresetExamples.ctaButton} {...props} />;
}

export function LoadingLiquidIndicator(props: Omit<LiquidEffectProps, keyof typeof liquidPresetExamples.loadingLiquid>) {
  return <LiquidEffect {...liquidPresetExamples.loadingLiquid} {...props} />;
}

export function BackgroundLiquidElement(props: Omit<LiquidEffectProps, keyof typeof liquidPresetExamples.backgroundLiquid>) {
  return <LiquidEffect {...liquidPresetExamples.backgroundLiquid} {...props} />;
}
