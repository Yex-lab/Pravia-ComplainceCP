'use client';

import { useState } from 'react';
import { m, useInView } from 'framer-motion';
import Box from '@mui/material/Box';
import { useRef } from 'react';
import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface AnimatedIconProps {
  children: React.ReactNode;
  animationType?: 'bounce' | 'rotate' | 'pulse' | 'scale' | 'shake' | 'float';
  hoverEffect?: boolean;
  scrollReveal?: boolean;
  delay?: number;
  size?: number;
  sx?: object;
}

// ----------------------------------------------------------------------

const iconVariants = {
  // Bounce animation
  bounce: {
    hover: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop' as const,
      }
    },
    tap: { scale: 0.95 },
    scroll: {
      y: [20, 0],
      opacity: [0, 1],
      transition: { duration: 0.6, type: 'spring', stiffness: 100 }
    }
  },

  // Rotate animation
  rotate: {
    hover: {
      rotate: 360,
      transition: { duration: 0.8, ease: 'easeInOut' }
    },
    tap: { scale: 0.9 },
    scroll: {
      rotate: [180, 0],
      opacity: [0, 1],
      transition: { duration: 0.8, type: 'spring', stiffness: 80 }
    }
  },

  // Pulse animation
  pulse: {
    hover: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop' as const,
      }
    },
    tap: { scale: 0.9 },
    scroll: {
      scale: [0.5, 1],
      opacity: [0, 1],
      transition: { duration: 0.6, type: 'spring', stiffness: 120 }
    }
  },

  // Scale animation
  scale: {
    hover: { scale: 1.15 },
    tap: { scale: 0.95 },
    scroll: {
      scale: [0.8, 1],
      opacity: [0, 1],
      transition: { duration: 0.5, type: 'spring', stiffness: 100 }
    }
  },

  // Shake animation
  shake: {
    hover: {
      x: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.5, ease: 'easeInOut' }
    },
    tap: { scale: 0.95 },
    scroll: {
      x: [10, 0],
      opacity: [0, 1],
      transition: { duration: 0.6, type: 'spring', stiffness: 100 }
    }
  },

  // Float animation
  float: {
    hover: {
      y: [0, -6, 0],
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop' as const,
      }
    },
    tap: { scale: 0.95 },
    scroll: {
      y: [15, 0],
      opacity: [0, 1],
      transition: { duration: 0.7, type: 'spring', stiffness: 80 }
    }
  }
};

// ----------------------------------------------------------------------

export function AnimatedIcon({
  children,
  animationType = 'scale',
  hoverEffect = true,
  scrollReveal = true,
  delay = 0,
  size = 80,
  sx = {},
}: AnimatedIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const variants = iconVariants[animationType];

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: '50%',
        border: '1px solid rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
      }}
    >
      {children}
    </m.div>
  );
}

// ----------------------------------------------------------------------

// Preset icon components for different use cases
export function FeatureIcon({ 
  icon, 
  animationType = 'bounce',
  delay = 0,
  ...props 
}: { 
  icon: React.ReactNode;
  animationType?: AnimatedIconProps['animationType'];
  delay?: number;
} & Partial<AnimatedIconProps>) {
  return (
    <AnimatedIcon
      animationType={animationType}
      delay={delay}
      size={80}
      {...props}
    >
      {icon}
    </AnimatedIcon>
  );
}

export function NavIcon({ 
  icon, 
  animationType = 'scale',
  ...props 
}: { 
  icon: React.ReactNode;
  animationType?: AnimatedIconProps['animationType'];
} & Partial<AnimatedIconProps>) {
  return (
    <AnimatedIcon
      animationType={animationType}
      size={40}
      scrollReveal={false}
      sx={{
        background: 'transparent',
        border: 'none',
        '&:hover': {
          background: (theme: Theme) => `${theme.palette.primary.main}10`,
        },
      }}
      {...props}
    >
      {icon}
    </AnimatedIcon>
  );
}

export function SocialIcon({ 
  icon, 
  animationType = 'bounce',
  ...props 
}: { 
  icon: React.ReactNode;
  animationType?: AnimatedIconProps['animationType'];
} & Partial<AnimatedIconProps>) {
  return (
    <AnimatedIcon
      animationType={animationType}
      size={48}
      scrollReveal={false}
      sx={{
        background: (theme: Theme) => `${theme.palette.primary.main}15`,
        '&:hover': {
          background: (theme: Theme) => theme.palette.primary.main,
          color: 'primary.contrastText',
          transform: 'translateY(-2px)',
        },
      }}
      {...props}
    >
      {icon}
    </AnimatedIcon>
  );
}

// ----------------------------------------------------------------------

// Icon group with staggered animations
export function IconGroup({ 
  icons, 
  animationType = 'scale',
  staggerDelay = 0.1,
  ...props 
}: {
  icons: React.ReactNode[];
  animationType?: AnimatedIconProps['animationType'];
  staggerDelay?: number;
} & Partial<AnimatedIconProps>) {
  return (
    <>
      {icons.map((icon, index) => (
        <AnimatedIcon
          key={index}
          animationType={animationType}
          delay={index * staggerDelay}
          {...props}
        >
          {icon}
        </AnimatedIcon>
      ))}
    </>
  );
}

// ----------------------------------------------------------------------

// Special effects for specific contexts
export function LoadingIcon({ 
  icon,
  isLoading = false,
}: {
  icon: React.ReactNode;
  isLoading?: boolean;
}) {
  return (
    <Box
      component={m.div}
      animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
      transition={{
        duration: 1,
        ease: 'linear',
        repeat: isLoading ? Infinity : 0,
      }}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Box>
  );
}

export function StatusIcon({ 
  icon,
  status = 'idle',
}: {
  icon: React.ReactNode;
  status?: 'idle' | 'success' | 'error' | 'warning';
}) {
  const statusColors = {
    idle: 'text.secondary',
    success: 'success.main',
    error: 'error.main',
    warning: 'warning.main',
  };

  return (
    <Box
      component={m.div}
      animate={{
        scale: status !== 'idle' ? [1, 1.2, 1] : 1,
        color: statusColors[status],
      }}
      transition={{
        duration: 0.3,
        type: 'spring',
        stiffness: 200,
      }}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Box>
  );
}
