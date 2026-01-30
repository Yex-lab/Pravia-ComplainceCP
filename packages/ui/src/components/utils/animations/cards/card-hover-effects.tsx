'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useColorScheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface HoverCardProps {
  children: React.ReactNode;
  scaleOnHover?: number;
  sx?: object;
  disabled?: boolean;
}

// ----------------------------------------------------------------------

export function HoverCard({
  children,
  scaleOnHover = 1.02,
  sx = {},
  disabled = false,
}: HoverCardProps) {
  const { mode } = useColorScheme() || { mode: 'light' };
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      component={m.div}
      whileHover={!disabled ? {
        scale: scaleOnHover,
        y: -4,
      } : undefined}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        cursor: disabled ? 'default' : 'pointer',
        ...sx,
      }}
    >
      <Card
        sx={{
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          // Ensure crisp text rendering
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
          // Simple clean shadow on hover
          ...(isHovered && !disabled && {
            boxShadow: mode === 'dark'
              ? `0 20px 40px -8px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.2)`
              : `0 20px 40px -8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.1)`,
          }),
        }}
      >
        {children}
      </Card>
    </Box>
  );
}

// ----------------------------------------------------------------------

// Preset card components for different use cases
export function FeatureHoverCard({ 
  children, 
  ...props 
}: { children: React.ReactNode } & Partial<HoverCardProps>) {
  return (
    <HoverCard
      scaleOnHover={1.02}
      {...props}
    >
      {children}
    </HoverCard>
  );
}

export function TestimonialHoverCard({ 
  children, 
  ...props 
}: { children: React.ReactNode } & Partial<HoverCardProps>) {
  return (
    <HoverCard
      scaleOnHover={1.015}
      {...props}
    >
      {children}
    </HoverCard>
  );
}
