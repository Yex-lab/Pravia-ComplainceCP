// @ts-nocheck
'use client';

import type { CardProps } from '@mui/material/Card';
import type { BoxProps } from '@mui/material/Box';

import { useRef, useState, useCallback } from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useColorScheme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

// ----------------------------------------------------------------------

interface Card3DEffectProps extends Omit<CardProps, 'children'> {
  /** Children to render inside the 3D card */
  children: React.ReactNode;
  /** 3D effect intensity */
  intensity?: 'subtle' | 'medium' | 'strong' | 'dramatic';
  /** Enable tilt effect on hover */
  enableTilt?: boolean;
  /** Enable scale effect on hover */
  enableScale?: boolean;
  /** Enable glow effect on hover */
  enableGlow?: boolean;
  /** Enable depth shadows */
  enableDepth?: boolean;
  /** Enable shine/reflection effect */
  enableShine?: boolean;
  /** Custom tilt intensity (overrides preset) */
  tiltIntensity?: number;
  /** Custom scale factor */
  scaleFactor?: number;
  /** Disable 3D effects */
  disabled?: boolean;
  /** Spring configuration for animations */
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

interface Container3DProps extends Omit<BoxProps, 'children'> {
  /** Children to render inside the 3D container */
  children: React.ReactNode;
  /** 3D effect preset */
  preset?: 'card' | 'feature' | 'testimonial' | 'product' | 'hero';
  /** Enable perspective container */
  enablePerspective?: boolean;
}

// ----------------------------------------------------------------------
// Preset configurations for different 3D effects

const card3DPresets = {
  subtle: {
    tiltIntensity: 8,
    scaleFactor: 1.02,
    springConfig: { stiffness: 300, damping: 30, mass: 0.5 },
    glowIntensity: 0.1,
    depthIntensity: 0.3,
  },
  medium: {
    tiltIntensity: 12,
    scaleFactor: 1.05,
    springConfig: { stiffness: 250, damping: 25, mass: 0.8 },
    glowIntensity: 0.2,
    depthIntensity: 0.5,
  },
  strong: {
    tiltIntensity: 18,
    scaleFactor: 1.08,
    springConfig: { stiffness: 200, damping: 20, mass: 1.0 },
    glowIntensity: 0.3,
    depthIntensity: 0.7,
  },
  dramatic: {
    tiltIntensity: 25,
    scaleFactor: 1.12,
    springConfig: { stiffness: 150, damping: 15, mass: 1.2 },
    glowIntensity: 0.4,
    depthIntensity: 1.0,
  },
};

// ----------------------------------------------------------------------

export function Card3DEffect({
  children,
  intensity = 'medium',
  enableTilt = true,
  enableScale = true,
  enableGlow = true,
  enableDepth = true,
  enableShine = true,
  tiltIntensity,
  scaleFactor,
  disabled = false,
  springConfig,
  sx,
  ...other
}: Card3DEffectProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const { mode } = useColorScheme() || { mode: 'light' };

  // Get preset configuration
  const config = {
    ...card3DPresets[intensity],
    ...(tiltIntensity !== undefined && { tiltIntensity }),
    ...(scaleFactor !== undefined && { scaleFactor }),
    ...(springConfig && { springConfig: { ...card3DPresets[intensity].springConfig, ...springConfig } }),
  };

  // Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smooth movement
  const springX = useSpring(mouseX, config.springConfig);
  const springY = useSpring(mouseY, config.springConfig);

  // Transform mouse position to rotation values
  const rotateX = useTransform(springY, [-0.5, 0.5], [config.tiltIntensity, -config.tiltIntensity]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-config.tiltIntensity, config.tiltIntensity]);

  // Transform for shine effect
  const shineX = useTransform(springX, [-0.5, 0.5], [0, 100]);
  const shineY = useTransform(springY, [-0.5, 0.5], [0, 100]);

  // Handle mouse movement
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (disabled || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseXPos = (event.clientX - centerX) / (rect.width / 2);
    const mouseYPos = (event.clientY - centerY) / (rect.height / 2);

    mouseX.set(mouseXPos);
    mouseY.set(mouseYPos);
  }, [disabled, mouseX, mouseY]);

  // Handle mouse enter
  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    setIsHovered(true);
  }, [disabled]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (disabled) return;
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [disabled, mouseX, mouseY]);

  // Get glow color based on theme
  const getGlowColor = useCallback(() => {
    return mode === 'dark' 
      ? `${theme.palette.primary.main}40`
      : `${theme.palette.primary.main}20`;
  }, [mode, theme]);

  // Get depth shadow
  const getDepthShadow = useCallback(() => {
    const baseOpacity = mode === 'dark' ? 0.3 : 0.15;
    const intensity = config.depthIntensity * baseOpacity;
    
    return isHovered
      ? `0 20px 40px rgba(0, 0, 0, ${intensity}), 0 0 0 1px ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`
      : `0 4px 20px rgba(0, 0, 0, ${intensity * 0.5})`;
  }, [isHovered, config.depthIntensity, mode]);

  return (
    <Card
      ref={cardRef}
      component={m.div}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: enableTilt 
          ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${enableScale && isHovered ? config.scaleFactor : 1})`
          : `scale(${enableScale && isHovered ? config.scaleFactor : 1})`,
      }}
      sx={[
        {
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'all 0.1s ease-out',
          cursor: 'pointer',
          overflow: 'hidden',
          ...(enableDepth && {
            boxShadow: getDepthShadow(),
          }),
          ...(enableGlow && isHovered && {
            boxShadow: `${getDepthShadow()}, 0 0 30px ${getGlowColor()}`,
          }),
          '&:hover': {
            '& .card-3d-content': {
              transform: 'translateZ(20px)',
            },
            '& .card-3d-shine': {
              opacity: enableShine ? 1 : 0,
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* Shine/Reflection Effect */}
      {enableShine && (
        <Box
          component={m.div}
          className="card-3d-shine"
          style={{
            background: `linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.1) ${shineX}%, rgba(255, 255, 255, 0.2) ${shineY}%, transparent 70%)`,
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      {/* Content Container */}
      <Box
        className="card-3d-content"
        sx={{
          position: 'relative',
          zIndex: 2,
          transition: 'transform 0.3s ease',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------
// 3D Container for grouping multiple 3D elements

export function Container3D({
  children,
  preset = 'card',
  enablePerspective = true,
  sx,
  ...other
}: Container3DProps) {
  const perspectiveValues = {
    card: 1000,
    feature: 1200,
    testimonial: 800,
    product: 1500,
    hero: 2000,
  };

  return (
    <Box
      sx={[
        {
          ...(enablePerspective && {
            perspective: perspectiveValues[preset],
            perspectiveOrigin: 'center center',
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------
// Specialized 3D Card Components

export function FeatureCard3D(props: Omit<Card3DEffectProps, 'intensity'>) {
  return (
    <Card3DEffect
      intensity="medium"
      enableTilt={true}
      enableScale={true}
      enableGlow={true}
      enableDepth={true}
      enableShine={true}
      {...props}
    />
  );
}

export function TestimonialCard3D(props: Omit<Card3DEffectProps, 'intensity'>) {
  return (
    <Card3DEffect
      intensity="subtle"
      enableTilt={true}
      enableScale={true}
      enableGlow={false}
      enableDepth={true}
      enableShine={true}
      {...props}
    />
  );
}

export function ProductCard3D(props: Omit<Card3DEffectProps, 'intensity'>) {
  return (
    <Card3DEffect
      intensity="strong"
      enableTilt={true}
      enableScale={true}
      enableGlow={true}
      enableDepth={true}
      enableShine={true}
      {...props}
    />
  );
}

export function HeroCard3D(props: Omit<Card3DEffectProps, 'intensity'>) {
  return (
    <Card3DEffect
      intensity="dramatic"
      enableTilt={true}
      enableScale={true}
      enableGlow={true}
      enableDepth={true}
      enableShine={true}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// Preset intensity components

export function SubtleCard3D(props: Omit<Card3DEffectProps, 'intensity'>) {
  return <Card3DEffect intensity="subtle" {...props} />;
}

export function MediumCard3D(props: Omit<Card3DEffectProps, 'intensity'>) {
  return <Card3DEffect intensity="medium" {...props} />;
}

export function StrongCard3D(props: Omit<Card3DEffectProps, 'intensity'>) {
  return <Card3DEffect intensity="strong" {...props} />;
}

export function DramaticCard3D(props: Omit<Card3DEffectProps, 'intensity'>) {
  return <Card3DEffect intensity="dramatic" {...props} />;
}

// ----------------------------------------------------------------------
// Advanced 3D Components

export function InteractiveCard3D({
  children,
  onCardClick,
  ...props
}: Card3DEffectProps & { onCardClick?: () => void }) {
  return (
    <Card3DEffect
      intensity="medium"
      onClick={onCardClick}
      sx={{
        cursor: onCardClick ? 'pointer' : 'default',
        '&:active': {
          transform: 'scale(0.98)',
        },
      }}
      {...props}
    >
      {children}
    </Card3DEffect>
  );
}

export function FloatingCard3D(props: Card3DEffectProps) {
  return (
    <Card3DEffect
      intensity="medium"
      sx={{
        '&:hover': {
          transform: 'translateY(-8px)',
        },
      }}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// Usage examples and presets

export const card3DPresetExamples = {
  // Feature showcase cards
  featureShowcase: {
    intensity: 'medium' as const,
    enableTilt: true,
    enableScale: true,
    enableGlow: true,
    enableDepth: true,
    enableShine: true,
  },
  
  // Testimonial cards
  testimonialCard: {
    intensity: 'subtle' as const,
    enableTilt: true,
    enableScale: true,
    enableGlow: false,
    enableDepth: true,
    enableShine: true,
  },
  
  // Product/service cards
  productCard: {
    intensity: 'strong' as const,
    enableTilt: true,
    enableScale: true,
    enableGlow: true,
    enableDepth: true,
    enableShine: true,
  },
  
  // Hero section cards
  heroCard: {
    intensity: 'dramatic' as const,
    enableTilt: true,
    enableScale: true,
    enableGlow: true,
    enableDepth: true,
    enableShine: true,
  },
  
  // Minimal cards
  minimalCard: {
    intensity: 'subtle' as const,
    enableTilt: true,
    enableScale: false,
    enableGlow: false,
    enableDepth: true,
    enableShine: false,
  },
};

// ----------------------------------------------------------------------
// Easy preset components

export function FeatureShowcaseCard3D(props: Omit<Card3DEffectProps, keyof typeof card3DPresetExamples.featureShowcase>) {
  return <Card3DEffect {...card3DPresetExamples.featureShowcase} {...props} />;
}

export function TestimonialShowcaseCard3D(props: Omit<Card3DEffectProps, keyof typeof card3DPresetExamples.testimonialCard>) {
  return <Card3DEffect {...card3DPresetExamples.testimonialCard} {...props} />;
}

export function ProductShowcaseCard3D(props: Omit<Card3DEffectProps, keyof typeof card3DPresetExamples.productCard>) {
  return <Card3DEffect {...card3DPresetExamples.productCard} {...props} />;
}

export function HeroShowcaseCard3D(props: Omit<Card3DEffectProps, keyof typeof card3DPresetExamples.heroCard>) {
  return <Card3DEffect {...card3DPresetExamples.heroCard} {...props} />;
}

export function MinimalShowcaseCard3D(props: Omit<Card3DEffectProps, keyof typeof card3DPresetExamples.minimalCard>) {
  return <Card3DEffect {...card3DPresetExamples.minimalCard} {...props} />;
}
