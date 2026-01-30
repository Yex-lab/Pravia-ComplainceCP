'use client';

import { useState, useEffect, useRef } from 'react';
import { m, useInView } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface CounterAnimationProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  sx?: object;
  decimals?: number;
  separator?: string;
  triggerOnce?: boolean;
}

// ----------------------------------------------------------------------

export function CounterAnimation({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  suffix = '',
  prefix = '',
  variant = 'h3',
  sx = {},
  decimals = 0,
  separator = ',',
  triggerOnce = true,
}: CounterAnimationProps) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: triggerOnce, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now() + (delay * 1000);
    const endTime = startTime + (duration * 1000);
    
    const timer = setInterval(() => {
      const now = Date.now();
      
      if (now < startTime) return;
      
      if (now >= endTime) {
        setCount(to);
        clearInterval(timer);
        return;
      }
      
      const progress = (now - startTime) / (duration * 1000);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = from + (to - from) * easeOutQuart;
      
      setCount(currentCount);
    }, 16); // ~60fps

    return () => clearInterval(timer);
  }, [isInView, from, to, duration, delay]);

  const formatNumber = (num: number) => {
    const rounded = Number(num.toFixed(decimals));
    return rounded.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <Typography
      ref={ref}
      variant={variant}
      component={m.div}
      sx={{
        fontWeight: 700,
        color: 'primary.main',
        ...sx,
      }}
    >
      {prefix}{formatNumber(count)}{suffix}
    </Typography>
  );
}

// ----------------------------------------------------------------------

// Progress bar counter
export function ProgressCounter({
  percentage,
  duration = 2,
  delay = 0,
  height = 8,
  sx = {},
  triggerOnce = true,
}: {
  percentage: number;
  duration?: number;
  delay?: number;
  height?: number;
  sx?: object;
  triggerOnce?: boolean;
}) {
  const { mode } = useColorScheme() || { mode: 'light' };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: triggerOnce, margin: '-100px' });

  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        height,
        bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderRadius: height / 2,
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box
        component={m.div}
        initial={{ width: 0 }}
        animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
        transition={{
          duration,
          delay,
          ease: 'easeOut',
        }}
        sx={{
          height: '100%',
          background: (theme) => 
            `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          borderRadius: height / 2,
        }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

// Preset counter components
export function StatCounter({ value, label, suffix = '', ...props }: {
  value: number;
  label: string;
  suffix?: string;
} & Partial<CounterAnimationProps>) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <CounterAnimation
        to={value}
        suffix={suffix}
        variant="h3"
        duration={2.5}
        {...props}
      />
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
        {label}
      </Typography>
    </Box>
  );
}

export function MetricCounter({ 
  value, 
  label, 
  prefix = '', 
  suffix = '',
  ...props 
}: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
} & Partial<CounterAnimationProps>) {
  return (
    <Box>
      <CounterAnimation
        to={value}
        prefix={prefix}
        suffix={suffix}
        variant="h4"
        duration={2}
        sx={{ mb: 0.5 }}
        {...props}
      />
      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
        {label}
      </Typography>
    </Box>
  );
}
