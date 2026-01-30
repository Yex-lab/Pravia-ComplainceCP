'use client';

import { m } from 'framer-motion';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface AnimatedGradientTextProps {
  text: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  colors?: string[];
  gradientAngle?: number;
  animationDuration?: number;
  animationDelay?: number;
  sx?: object;
  component?: React.ElementType;
}

// ----------------------------------------------------------------------

export function AnimatedGradientText({
  text,
  variant = 'h1',
  colors = ['primary.main', 'secondary.main'],
  gradientAngle = 300,
  animationDuration = 20,
  animationDelay = 2.6,
  sx = {},
  component,
}: AnimatedGradientTextProps) {
  const theme = useTheme();

  const getColor = (colorPath: string) => {
    const keys = colorPath.split('.');
    return keys.reduce((obj, key) => obj?.[key], theme.palette as any) || colorPath;
  };

  const gradientColors = colors.map((color, i) => 
    `${getColor(color)} ${i * 25}%`
  ).join(', ');

  return (
    <Typography
      variant={variant}
      component={m.span as any}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        backgroundPosition: ['0% center', '200% center', '0% center']
      }}
      transition={{ 
        opacity: { delay: animationDelay, duration: 0.8 },
        y: { delay: animationDelay, duration: 0.8 },
        backgroundPosition: {
          delay: animationDelay + 0.8,
          duration: animationDuration,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'reverse',
        }
      }}
      sx={{
        background: `linear-gradient(${gradientAngle}deg, ${gradientColors})`,
        backgroundSize: '400%',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        display: 'inline',
        ...sx,
      }}
    >
      {text}
    </Typography>
  );
}
