'use client';

import type { BoxProps } from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

import { useState, useEffect, useRef, useCallback } from 'react';
import { m, useAnimationControls, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

interface MorphingShapeProps extends Omit<BoxProps, 'children'> {
  /** Array of SVG paths to morph between */
  paths?: string[];
  /** Animation duration in seconds */
  duration?: number;
  /** Delay between shape changes */
  interval?: number;
  /** Shape size */
  size?: number | string;
  /** Fill color (will use theme colors if not provided) */
  fillColor?: string;
  /** Stroke color */
  strokeColor?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Animation preset */
  preset?: 'blob' | 'geometric' | 'organic' | 'tech' | 'minimal' | 'custom';
  /** Enable continuous morphing */
  continuous?: boolean;
  /** Enable hover interaction */
  enableHover?: boolean;
  /** Hover scale factor */
  hoverScale?: number;
  /** Enable rotation animation */
  enableRotation?: boolean;
  /** Rotation speed (degrees per second) */
  rotationSpeed?: number;
  /** Custom viewBox for SVG */
  viewBox?: string;
  /** Animation easing */
  easing?: string;
}

// ----------------------------------------------------------------------
// Predefined shape paths for different presets

const shapePresets = {
  blob: [
    // Blob shapes - organic, fluid forms
    'M60,20 C80,10 90,30 85,50 C90,70 70,85 50,80 C30,85 10,70 15,50 C10,30 30,10 60,20 Z',
    'M50,15 C70,20 85,35 80,55 C85,75 65,85 45,80 C25,85 15,65 20,45 C15,25 35,10 50,15 Z',
    'M55,25 C75,15 85,40 80,60 C85,80 60,85 40,75 C20,80 15,55 25,35 C20,15 40,20 55,25 Z',
    'M45,20 C65,25 80,45 75,65 C80,85 55,80 35,70 C15,75 20,50 30,30 C25,10 45,15 45,20 Z',
  ],
  geometric: [
    // Geometric shapes - clean, structured forms
    'M50,10 L90,50 L50,90 L10,50 Z', // Diamond
    'M20,20 L80,20 L80,80 L20,80 Z', // Square
    'M50,15 L85,75 L15,75 Z', // Triangle
    'M50,20 L70,30 L80,50 L70,70 L50,80 L30,70 L20,50 L30,30 Z', // Octagon
  ],
  organic: [
    // Organic shapes - nature-inspired forms
    'M50,10 C70,10 90,30 90,50 C90,70 70,90 50,90 C30,90 10,70 10,50 C10,30 30,10 50,10 Z', // Circle
    'M50,15 C65,20 80,35 85,50 C80,65 65,80 50,85 C35,80 20,65 15,50 C20,35 35,20 50,15 Z', // Oval
    'M30,20 C50,10 70,20 80,40 C85,60 70,80 50,85 C30,80 15,60 20,40 C25,20 30,20 30,20 Z', // Leaf
    'M50,20 C60,15 75,25 80,40 C85,55 75,70 60,75 C50,80 40,75 25,70 C15,55 20,40 25,25 C30,15 40,15 50,20 Z', // Petal
  ],
  tech: [
    // Tech-inspired shapes - futuristic, angular
    'M50,10 L80,25 L90,50 L80,75 L50,90 L20,75 L10,50 L20,25 Z', // Hexagon
    'M30,20 L70,20 L85,35 L85,65 L70,80 L30,80 L15,65 L15,35 Z', // Rounded rectangle
    'M50,15 L75,30 L85,55 L75,80 L50,85 L25,80 L15,55 L25,30 Z', // Octagon variant
    'M40,10 L60,10 L80,30 L80,70 L60,90 L40,90 L20,70 L20,30 Z', // Chamfered square
  ],
  minimal: [
    // Minimal shapes - simple, clean
    'M50,20 C65,20 80,35 80,50 C80,65 65,80 50,80 C35,80 20,65 20,50 C20,35 35,20 50,20 Z', // Circle
    'M30,30 L70,30 L70,70 L30,70 Z', // Square
    'M50,25 L75,65 L25,65 Z', // Triangle
    'M50,20 L70,40 L50,80 L30,40 Z', // Diamond
  ],
  custom: [
    // Custom shapes - fallback for custom preset
    'M50,20 C65,20 80,35 80,50 C80,65 65,80 50,80 C35,80 20,65 20,50 C20,35 35,20 50,20 Z',
  ],
};

// ----------------------------------------------------------------------

export function MorphingShape({
  paths,
  duration = 2,
  interval = 3,
  size = 100,
  fillColor,
  strokeColor,
  strokeWidth = 0,
  preset = 'blob',
  continuous = true,
  enableHover = true,
  hoverScale = 1.1,
  enableRotation = false,
  rotationSpeed = 30,
  viewBox = '0 0 100 100',
  easing = 'easeInOut',
  sx,
  ...other
}: MorphingShapeProps) {
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const controls = useAnimationControls();
  
  // Use a simple mode detection or default to light
  const [mode] = useState<'light' | 'dark'>('light');

  // Get paths from preset or use custom paths
  const shapePaths = paths || shapePresets[preset] || shapePresets.blob;

  // Get theme-appropriate colors
  const getFillColor = useCallback(() => {
    if (fillColor) return fillColor;
    
    return mode === 'dark'
      ? 'rgba(59, 130, 246, 0.3)' // Blue with opacity
      : 'rgba(59, 130, 246, 0.2)';
  }, [fillColor, mode]);

  const getStrokeColor = useCallback(() => {
    if (strokeColor) return strokeColor;
    
    return mode === 'dark'
      ? 'rgba(59, 130, 246, 0.8)'
      : 'rgba(59, 130, 246, 0.6)';
  }, [strokeColor, mode]);

  // Animation variants
  const shapeVariants = {
    initial: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: hoverScale,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    rotate: {
      rotate: 360,
      transition: {
        duration: 360 / rotationSpeed,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  };

  // Path morphing animation
  const animatePath = useCallback(async () => {
    if (shapePaths.length <= 1) return;

    const nextIndex = (currentPathIndex + 1) % shapePaths.length;
    
    await controls.start({
      d: shapePaths[nextIndex],
      transition: {
        duration,
        ease: "easeInOut",
      },
    });

    setCurrentPathIndex(nextIndex);
  }, [currentPathIndex, shapePaths, duration, easing, controls]);

  // Start continuous morphing
  useEffect(() => {
    if (!continuous || shapePaths.length <= 1) return;

    intervalRef.current = setInterval(() => {
      animatePath();
    }, interval * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [continuous, interval, animatePath, shapePaths.length]);

  // Handle hover interactions
  const handleMouseEnter = useCallback(() => {
    if (!enableHover) return;
    setIsHovered(true);
  }, [enableHover]);

  const handleMouseLeave = useCallback(() => {
    if (!enableHover) return;
    setIsHovered(false);
  }, [enableHover]);

  // Handle click to trigger manual morph
  const handleClick = useCallback(() => {
    if (continuous) return; // Don't allow manual control if continuous
    animatePath();
  }, [continuous, animatePath]);

  return (
    <Box
      sx={[
        {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: continuous ? 'default' : 'pointer',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...other}
    >
      <m.div
        initial={{ scale: 1, rotate: 0 }}
        animate={isHovered && enableHover ? { scale: hoverScale } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <svg
          width={size}
          height={size}
          viewBox={viewBox}
          style={{
            overflow: 'visible',
            filter: mode === 'dark' 
              ? 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))'
              : 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))',
          }}
        >
          <m.path
            d={shapePaths[currentPathIndex]}
            fill={getFillColor()}
            stroke={strokeWidth > 0 ? getStrokeColor() : 'none'}
            strokeWidth={strokeWidth}
            animate={controls}
            initial={{ d: shapePaths[0] }}
          />
        </svg>
      </m.div>
    </Box>
  );
}

// ----------------------------------------------------------------------
// Preset components for easy use

export function BlobShape(props: Omit<MorphingShapeProps, 'preset'>) {
  return <MorphingShape preset="blob" {...props} />;
}

export function GeometricShape(props: Omit<MorphingShapeProps, 'preset'>) {
  return <MorphingShape preset="geometric" {...props} />;
}

export function OrganicShape(props: Omit<MorphingShapeProps, 'preset'>) {
  return <MorphingShape preset="organic" {...props} />;
}

export function TechShape(props: Omit<MorphingShapeProps, 'preset'>) {
  return <MorphingShape preset="tech" {...props} />;
}

export function MinimalShape(props: Omit<MorphingShapeProps, 'preset'>) {
  return <MorphingShape preset="minimal" {...props} />;
}

// ----------------------------------------------------------------------
// Advanced morphing components

export function AnimatedLogo({
  paths,
  size = 120,
  ...props
}: Omit<MorphingShapeProps, 'preset' | 'continuous'> & { paths: string[] }) {
  return (
    <MorphingShape
      paths={paths}
      size={size}
      continuous={true}
      duration={3}
      interval={4}
      enableHover={true}
      hoverScale={1.05}
      {...props}
    />
  );
}

export function InteractiveMorph({
  preset = 'blob',
  size = 80,
  ...props
}: Omit<MorphingShapeProps, 'continuous'>) {
  return (
    <MorphingShape
      preset={preset}
      size={size}
      continuous={false}
      enableHover={true}
      hoverScale={1.2}
      {...props}
    />
  );
}

export function RotatingMorph({
  preset = 'tech',
  size = 100,
  rotationSpeed = 45,
  ...props
}: MorphingShapeProps) {
  return (
    <MorphingShape
      preset={preset}
      size={size}
      enableRotation={true}
      rotationSpeed={rotationSpeed}
      continuous={true}
      duration={2.5}
      interval={4}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// Usage examples and presets

export const morphingPresetExamples = {
  // Hero section decoration
  heroDecoration: {
    preset: 'blob' as const,
    size: 200,
    continuous: true,
    duration: 4,
    interval: 6,
    enableRotation: true,
    rotationSpeed: 20,
    sx: { opacity: 0.6 },
  },
  
  // Feature section icons
  featureIcon: {
    preset: 'tech' as const,
    size: 60,
    continuous: false,
    enableHover: true,
    hoverScale: 1.15,
    strokeWidth: 2,
  },
  
  // Background elements
  backgroundElement: {
    preset: 'organic' as const,
    size: 150,
    continuous: true,
    duration: 5,
    interval: 8,
    sx: { opacity: 0.3, position: 'absolute' },
  },
  
  // Interactive buttons
  buttonDecoration: {
    preset: 'minimal' as const,
    size: 40,
    continuous: false,
    enableHover: true,
    hoverScale: 1.3,
  },
  
  // Loading indicators
  loadingIndicator: {
    preset: 'geometric' as const,
    size: 50,
    continuous: true,
    duration: 1.5,
    interval: 2,
    enableRotation: true,
    rotationSpeed: 60,
  },
};

// ----------------------------------------------------------------------
// Easy preset components

export function HeroMorphingShape(props: Omit<MorphingShapeProps, keyof Omit<typeof morphingPresetExamples.heroDecoration, 'sx'>>) {
  return <MorphingShape {...morphingPresetExamples.heroDecoration} {...props} />;
}

export function FeatureMorphingIcon(props: Omit<MorphingShapeProps, keyof Omit<typeof morphingPresetExamples.featureIcon, 'sx'>>) {
  return <MorphingShape {...morphingPresetExamples.featureIcon} {...props} />;
}

export function BackgroundMorphingElement(props: Omit<MorphingShapeProps, keyof Omit<typeof morphingPresetExamples.backgroundElement, 'sx'>>) {
  return <MorphingShape {...morphingPresetExamples.backgroundElement} {...props} />;
}

export function ButtonMorphingDecoration(props: Omit<MorphingShapeProps, keyof Omit<typeof morphingPresetExamples.buttonDecoration, 'sx'>>) {
  return <MorphingShape {...morphingPresetExamples.buttonDecoration} {...props} />;
}

export function LoadingMorphingIndicator(props: Omit<MorphingShapeProps, keyof Omit<typeof morphingPresetExamples.loadingIndicator, 'sx'>>) {
  return <MorphingShape {...morphingPresetExamples.loadingIndicator} {...props} />;
}
