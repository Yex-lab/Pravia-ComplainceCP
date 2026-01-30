'use client';

import type { BoxProps } from '@mui/material/Box';
import type { ButtonProps } from '@mui/material/Button';
import type { CardProps } from '@mui/material/Card';

import { useRef, useEffect, useState, useCallback } from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useColorScheme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';

// ----------------------------------------------------------------------

interface MagneticEffectProps extends Omit<BoxProps, 'children'> {
  /** Children to render inside magnetic container */
  children: React.ReactNode;
  /** Magnetic strength (0-1) */
  strength?: number;
  /** Detection radius in pixels */
  radius?: number;
  /** Animation preset */
  preset?: 'subtle' | 'medium' | 'strong' | 'elastic' | 'bounce';
  /** Enable scaling on proximity */
  enableScale?: boolean;
  /** Scale factor when hovered */
  scaleIntensity?: number;
  /** Enable rotation based on mouse position */
  enableRotation?: boolean;
  /** Rotation intensity */
  rotationIntensity?: number;
  /** Enable magnetic tilt effect */
  enableTilt?: boolean;
  /** Tilt intensity */
  tiltIntensity?: number;
  /** Custom spring configuration */
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  /** Disable magnetic effect */
  disabled?: boolean;
}

interface MagneticButtonProps extends Omit<ButtonProps, 'children'> {
  /** Children to render inside button */
  children: React.ReactNode;
  /** Magnetic strength */
  magneticStrength?: number;
  /** Enable magnetic glow effect */
  enableGlow?: boolean;
  /** Glow intensity */
  glowIntensity?: number;
}

interface MagneticCardProps extends Omit<CardProps, 'children'> {
  /** Children to render inside card */
  children: React.ReactNode;
  /** Magnetic tilt strength */
  tiltStrength?: number;
  /** Enable depth effect */
  enableDepth?: boolean;
}

// ----------------------------------------------------------------------
// Preset configurations for different magnetic behaviors

const magneticPresets = {
  subtle: {
    strength: 0.15,
    radius: 80,
    springConfig: { stiffness: 150, damping: 15, mass: 0.1 },
    scaleIntensity: 1.02,
    rotationIntensity: 2,
    tiltIntensity: 5,
  },
  medium: {
    strength: 0.25,
    radius: 120,
    springConfig: { stiffness: 200, damping: 20, mass: 0.2 },
    scaleIntensity: 1.05,
    rotationIntensity: 5,
    tiltIntensity: 10,
  },
  strong: {
    strength: 0.4,
    radius: 150,
    springConfig: { stiffness: 250, damping: 25, mass: 0.3 },
    scaleIntensity: 1.08,
    rotationIntensity: 8,
    tiltIntensity: 15,
  },
  elastic: {
    strength: 0.3,
    radius: 100,
    springConfig: { stiffness: 100, damping: 10, mass: 0.5 },
    scaleIntensity: 1.06,
    rotationIntensity: 6,
    tiltIntensity: 12,
  },
  bounce: {
    strength: 0.35,
    radius: 130,
    springConfig: { stiffness: 300, damping: 8, mass: 0.1 },
    scaleIntensity: 1.1,
    rotationIntensity: 10,
    tiltIntensity: 18,
  },
};

// ----------------------------------------------------------------------

export function MagneticEffect({
  children,
  strength,
  radius,
  preset = 'medium',
  enableScale = true,
  scaleIntensity,
  enableRotation = false,
  rotationIntensity,
  enableTilt = true,
  tiltIntensity,
  springConfig,
  disabled = false,
  sx,
  ...other
}: MagneticEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Get preset configuration
  const config = {
    ...magneticPresets[preset],
    ...(strength !== undefined && { strength }),
    ...(radius !== undefined && { radius }),
    ...(scaleIntensity !== undefined && { scaleIntensity }),
    ...(rotationIntensity !== undefined && { rotationIntensity }),
    ...(tiltIntensity !== undefined && { tiltIntensity }),
    ...(springConfig && { springConfig: { ...magneticPresets[preset].springConfig, ...springConfig } }),
  };

  // Motion values for smooth animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring animations for smooth magnetic effect
  const springX = useSpring(mouseX, config.springConfig);
  const springY = useSpring(mouseY, config.springConfig);
  
  // Transform values based on mouse position
  const rotateX = useTransform(springY, [-config.radius, config.radius], [config.tiltIntensity, -config.tiltIntensity]);
  const rotateY = useTransform(springX, [-config.radius, config.radius], [-config.tiltIntensity, config.tiltIntensity]);
  const rotateZ = useTransform(springX, [-config.radius, config.radius], [-config.rotationIntensity, config.rotationIntensity]);
  
  // Scale based on distance - using combineLatest approach
  const scale = useTransform(
    () => {
      const x = springX.get();
      const y = springY.get();
      if (!enableScale) return 1;
      const distance = Math.sqrt(x * x + y * y);
      const normalizedDistance = Math.min(distance / config.radius, 1);
      return 1 + (config.scaleIntensity - 1) * (1 - normalizedDistance);
    }
  );

  // Handle mouse movement
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (disabled || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance < config.radius) {
      // Apply magnetic effect
      const magneticX = deltaX * config.strength;
      const magneticY = deltaY * config.strength;
      
      mouseX.set(magneticX);
      mouseY.set(magneticY);
      setIsHovered(true);
    } else {
      // Reset position when outside radius
      mouseX.set(0);
      mouseY.set(0);
      setIsHovered(false);
    }
  }, [disabled, config, mouseX, mouseY]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  // Set up event listeners
  useEffect(() => {
    if (disabled) return;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, disabled]);

  return (
    <Box
      ref={containerRef}
      component={m.div}
      style={{
        x: springX,
        y: springY,
        scale: enableScale ? scale : 1,
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        rotateZ: enableRotation ? rotateZ : 0,
      }}
      sx={[
        {
          display: 'inline-block',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
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
// Magnetic Button Component

export function MagneticButton({
  children,
  magneticStrength = 0.3,
  enableGlow = true,
  glowIntensity = 0.3,
  sx,
  ...other
}: MagneticButtonProps) {
  const theme = useTheme();
  const { mode } = useColorScheme() || { mode: 'light' };
  
  return (
    <MagneticEffect
      strength={magneticStrength}
      preset="medium"
      enableScale={true}
      scaleIntensity={1.05}
      enableTilt={true}
      tiltIntensity={8}
    >
      <Button
        sx={[
          {
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: enableGlow
                ? `0 8px 25px ${theme.palette.primary.main}${Math.floor(glowIntensity * 255).toString(16).padStart(2, '0')}`
                : undefined,
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {children}
      </Button>
    </MagneticEffect>
  );
}

// ----------------------------------------------------------------------
// Magnetic Card Component

export function MagneticCard({
  children,
  tiltStrength = 0.2,
  enableDepth = true,
  sx,
  ...other
}: MagneticCardProps) {
  const theme = useTheme();
  const { mode } = useColorScheme() || { mode: 'light' };
  
  return (
    <MagneticEffect
      strength={tiltStrength}
      preset="subtle"
      enableScale={true}
      scaleIntensity={1.02}
      enableTilt={true}
      tiltIntensity={6}
      radius={200}
    >
      <Card
        sx={[
          {
            transition: 'all 0.3s ease',
            transformStyle: 'preserve-3d',
            '&:hover': {
              boxShadow: enableDepth
                ? mode === 'dark'
                  ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  : '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                : undefined,
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {children}
      </Card>
    </MagneticEffect>
  );
}

// ----------------------------------------------------------------------
// Advanced Magnetic Components

export function MagneticLogo({
  children,
  intensity = 'subtle',
  ...props
}: Omit<MagneticEffectProps, 'preset'> & { intensity?: 'subtle' | 'medium' | 'strong' }) {
  return (
    <MagneticEffect
      preset={intensity}
      enableScale={true}
      enableRotation={true}
      enableTilt={false}
      radius={100}
      {...props}
    >
      {children}
    </MagneticEffect>
  );
}

export function MagneticCTA({
  children,
  ...props
}: Omit<MagneticEffectProps, 'preset'>) {
  return (
    <MagneticEffect
      preset="strong"
      enableScale={true}
      scaleIntensity={1.08}
      enableTilt={true}
      tiltIntensity={12}
      radius={150}
      {...props}
    >
      {children}
    </MagneticEffect>
  );
}

export function MagneticIcon({
  children,
  ...props
}: Omit<MagneticEffectProps, 'preset'>) {
  return (
    <MagneticEffect
      preset="elastic"
      enableScale={true}
      scaleIntensity={1.15}
      enableRotation={true}
      rotationIntensity={15}
      enableTilt={false}
      radius={80}
      {...props}
    >
      {children}
    </MagneticEffect>
  );
}

// ----------------------------------------------------------------------
// Preset components for easy use

export function SubtleMagnetic(props: Omit<MagneticEffectProps, 'preset'>) {
  return <MagneticEffect preset="subtle" {...props} />;
}

export function MediumMagnetic(props: Omit<MagneticEffectProps, 'preset'>) {
  return <MagneticEffect preset="medium" {...props} />;
}

export function StrongMagnetic(props: Omit<MagneticEffectProps, 'preset'>) {
  return <MagneticEffect preset="strong" {...props} />;
}

export function ElasticMagnetic(props: Omit<MagneticEffectProps, 'preset'>) {
  return <MagneticEffect preset="elastic" {...props} />;
}

export function BounceMagnetic(props: Omit<MagneticEffectProps, 'preset'>) {
  return <MagneticEffect preset="bounce" {...props} />;
}

// ----------------------------------------------------------------------
// Usage examples and presets

export const magneticPresetExamples = {
  // CTA buttons with strong magnetic pull
  ctaButton: {
    preset: 'strong' as const,
    enableScale: true,
    scaleIntensity: 1.08,
    enableTilt: true,
    tiltIntensity: 12,
    radius: 150,
  },
  
  // Feature cards with subtle magnetic tilt
  featureCard: {
    preset: 'subtle' as const,
    enableScale: true,
    scaleIntensity: 1.02,
    enableTilt: true,
    tiltIntensity: 6,
    radius: 200,
  },
  
  // Navigation items with medium magnetic effect
  navItem: {
    preset: 'medium' as const,
    enableScale: true,
    scaleIntensity: 1.05,
    enableRotation: true,
    rotationIntensity: 5,
    radius: 100,
  },
  
  // Logo with elastic magnetic response
  logo: {
    preset: 'elastic' as const,
    enableScale: true,
    scaleIntensity: 1.06,
    enableRotation: true,
    rotationIntensity: 8,
    radius: 120,
  },
  
  // Icons with bouncy magnetic effect
  icon: {
    preset: 'bounce' as const,
    enableScale: true,
    scaleIntensity: 1.15,
    enableRotation: true,
    rotationIntensity: 15,
    radius: 80,
  },
};

// ----------------------------------------------------------------------
// Easy preset components

export function CtaMagneticButton(props: Omit<MagneticButtonProps, keyof typeof magneticPresetExamples.ctaButton>) {
  return (
    <MagneticEffect {...magneticPresetExamples.ctaButton}>
      <MagneticButton {...props} />
    </MagneticEffect>
  );
}

export function FeatureMagneticCard(props: Omit<MagneticCardProps, keyof typeof magneticPresetExamples.featureCard>) {
  return (
    <MagneticEffect {...magneticPresetExamples.featureCard}>
      <MagneticCard {...props} />
    </MagneticEffect>
  );
}

export function NavMagneticItem(props: Omit<MagneticEffectProps, keyof typeof magneticPresetExamples.navItem>) {
  return <MagneticEffect {...magneticPresetExamples.navItem} {...props} />;
}

export function LogoMagneticEffect(props: Omit<MagneticEffectProps, keyof typeof magneticPresetExamples.logo>) {
  return <MagneticEffect {...magneticPresetExamples.logo} {...props} />;
}

export function IconMagneticEffect(props: Omit<MagneticEffectProps, keyof typeof magneticPresetExamples.icon>) {
  return <MagneticEffect {...magneticPresetExamples.icon} {...props} />;
}
