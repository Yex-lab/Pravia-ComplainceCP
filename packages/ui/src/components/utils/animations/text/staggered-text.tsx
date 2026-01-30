'use client';

import { useState, useEffect } from 'react';
import { m, AnimatePresence, type MotionValue } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface StaggeredTextProps {
  text: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  delay?: number;
  duration?: number;
  staggerDelay?: number;
  animationType?: 'fadeUp' | 'fadeIn' | 'typewriter' | 'glitch';
  animationUnit?: 'word' | 'letter';
  parallaxY?: MotionValue<number>;
  sx?: object;
  component?: React.ElementType;
  startAnimation?: boolean;
}

// ----------------------------------------------------------------------

const letterVariants = {
  fadeUp: {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
    }
  },
  fadeIn: {
    hidden: { 
      opacity: 0,
      scale: 0.5,
    },
    visible: { 
      opacity: 1,
      scale: 1,
    }
  },
  typewriter: {
    hidden: { 
      opacity: 0,
      width: 0,
    },
    visible: { 
      opacity: 1,
      width: 'auto',
    }
  },
  glitch: {
    hidden: { 
      opacity: 0,
      x: Math.random() * 20 - 10,
      y: Math.random() * 10 - 5,
      skewX: Math.random() * 5 - 2.5,
    },
    visible: { 
      opacity: 1,
      x: 0,
      y: 0,
      skewX: 0,
    }
  }
};

// ----------------------------------------------------------------------

export function StaggeredText({
  text,
  variant = 'h1',
  delay = 0,
  duration = 0.05,
  staggerDelay = 0.03,
  animationType = 'fadeUp',
  animationUnit = 'word',
  parallaxY,
  sx = {},
  component,
  startAnimation = true,
}: StaggeredTextProps) {
  const { mode } = useColorScheme() || { mode: 'light' };
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    if (startAnimation) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [startAnimation, delay]);

  const units = animationUnit === 'word' ? text.split(' ') : text.split('');

  const content = (
    <Typography
      variant={variant}
      sx={{
        ...sx,
      }}
    >
      {animationUnit === 'word' ? (
        <>
          {text.split(' ').map((word, index) => (
            <Box
              key={index}
              component={m.span}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: delay + index * staggerDelay,
                duration: 0.4,
                type: 'spring',
                stiffness: 100,
                damping: 12,
              }}
              sx={{ display: 'inline-block', mr: 1 }}
            >
              {word}
            </Box>
          ))}
        </>
      ) : (
        <AnimatePresence>
          {text.split('').map((letter, index) => (
            <Box
              key={`${letter}-${index}`}
              component={m.span}
              variants={letterVariants[animationType]}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              transition={{
                delay: index * staggerDelay,
                type: 'spring',
                stiffness: 100,
                damping: 12,
              }}
              sx={{
                display: 'inline-block',
                whiteSpace: letter === ' ' ? 'pre' : 'normal',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </Box>
          ))}
        </AnimatePresence>
      )}
    </Typography>
  );

  // Wrap in m.div if parallax is needed
  if (parallaxY) {
    return (
      <m.div style={{ y: parallaxY }}>
        {content}
      </m.div>
    );
  }

  return content;
}

// ----------------------------------------------------------------------

// Word-by-word animation variant
export function StaggeredWords({
  text,
  variant = 'h1',
  delay = 0,
  duration = 0.4,
  staggerDelay = 0.1,
  animationType = 'fadeUp',
  sx = {},
  component,
  startAnimation = true,
}: StaggeredTextProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    if (startAnimation) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [startAnimation, delay]);

  const words = text.split(' ');

  return (
    <Typography
      variant={variant}
      component={component as any}
      sx={{
        display: 'inline-block',
        ...sx,
      }}
    >
      <AnimatePresence>
        {words.map((word, index) => (
          <Box
            key={`${word}-${index}`}
            component={m.span}
            variants={letterVariants[animationType]}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            transition={{
              delay: index * staggerDelay,
              type: 'spring',
              stiffness: 100,
              damping: 12,
            }}
            sx={{
              display: 'inline-block',
              marginRight: index < words.length - 1 ? 1 : 0,
            }}
          >
            {word}
          </Box>
        ))}
      </AnimatePresence>
    </Typography>
  );
}

// ----------------------------------------------------------------------

// Typewriter effect with cursor
export function TypewriterText({
  text,
  variant = 'h1',
  delay = 0,
  speed = 100,
  showCursor = true,
  cursorChar = '|',
  sx = {},
  component,
  startAnimation = true,
}: Omit<StaggeredTextProps, 'staggerDelay' | 'animationType'> & {
  speed?: number;
  showCursor?: boolean;
  cursorChar?: string;
}) {
  const { mode } = useColorScheme() || { mode: 'light' };
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursorState, setShowCursorState] = useState(true);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    
    if (!startAnimation) return;

    const startTimer = setTimeout(() => {
      const typeTimer = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex < text.length) {
            setDisplayText(text.slice(0, prevIndex + 1));
            return prevIndex + 1;
          } else {
            clearInterval(typeTimer);
            return prevIndex;
          }
        });
      }, speed);

      return () => clearInterval(typeTimer);
    }, delay * 1000);

    return () => clearTimeout(startTimer);
  }, [text, speed, delay, startAnimation]);

  // Cursor blinking effect
  useEffect(() => {
    if (showCursor) {
      const cursorTimer = setInterval(() => {
        setShowCursorState((prev) => !prev);
      }, 500);
      return () => clearInterval(cursorTimer);
    }
  }, [showCursor]);

  return (
    <Typography
      variant={variant}
      component={component as any}
      sx={{
        display: 'inline-block',
        ...sx,
      }}
    >
      {displayText}
      {showCursor && (
        <Box
          component="span"
          sx={{
            opacity: showCursorState ? 1 : 0,
            transition: 'opacity 0.1s ease',
            color: mode === 'dark' ? 'primary.light' : 'primary.main',
            fontWeight: 'normal',
          }}
        >
          {cursorChar}
        </Box>
      )}
    </Typography>
  );
}

// ----------------------------------------------------------------------

// AI-themed glitch text effect
export function GlitchText({
  text,
  variant = 'h1',
  delay = 0,
  glitchDuration = 2000,
  sx = {},
  component,
  startAnimation = true,
}: Omit<StaggeredTextProps, 'staggerDelay' | 'animationType' | 'duration'> & {
  glitchDuration?: number;
}) {
  const { mode } = useColorScheme() || { mode: 'light' };
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (!startAnimation) return;

    const startTimer = setTimeout(() => {
      setIsGlitching(true);
      const stopTimer = setTimeout(() => {
        setIsGlitching(false);
      }, glitchDuration);
      return () => clearTimeout(stopTimer);
    }, delay * 1000);

    return () => clearTimeout(startTimer);
  }, [delay, glitchDuration, startAnimation]);

  return (
    <Box
      component={m.div}
      animate={isGlitching ? {
        x: [0, -2, 2, -1, 1, 0],
        textShadow: [
          'none',
          '2px 0 #ff0000, -2px 0 #00ffff',
          '1px 0 #ff0000, -1px 0 #00ffff',
          'none'
        ],
      } : {}}
      transition={{
        duration: 0.1,
        repeat: isGlitching ? Infinity : 0,
        repeatType: 'mirror',
      }}
      sx={{
        display: 'inline-block',
      }}
    >
      <Typography
        variant={variant}
        component={component as any}
        sx={{
          display: 'inline-block',
          background: mode === 'dark' 
            ? 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00)'
            : 'linear-gradient(45deg, #1976d2, #9c27b0, #ff9800)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: isGlitching ? 'transparent' : 'inherit',
          transition: 'all 0.3s ease',
          ...sx,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

// Preset configurations for easy use
export const textAnimationPresets = {
  heroTitle: {
    variant: 'h1' as const,
    animationType: 'fadeUp' as const,
    delay: 0.5,
    staggerDelay: 0.05,
    duration: 0.6,
  },
  heroSubtitle: {
    variant: 'h5' as const,
    animationType: 'fadeIn' as const,
    delay: 2,
    staggerDelay: 0.02,
    duration: 0.4,
  },
  sectionTitle: {
    variant: 'h2' as const,
    animationType: 'fadeUp' as const,
    delay: 0.2,
    staggerDelay: 0.03,
    duration: 0.5,
  },
  aiGlitch: {
    variant: 'h1' as const,
    delay: 0.5,
    glitchDuration: 1500,
  },
  typewriter: {
    variant: 'h2' as const,
    delay: 1,
    speed: 80,
    showCursor: true,
  },
};

// ----------------------------------------------------------------------

// Easy-to-use preset components
export function HeroTitleText({ text, ...props }: { text: string } & Partial<StaggeredTextProps>) {
  return <StaggeredText text={text} {...textAnimationPresets.heroTitle} {...props} />;
}

export function HeroSubtitleText({ text, ...props }: { text: string } & Partial<StaggeredTextProps>) {
  return <StaggeredText text={text} {...textAnimationPresets.heroSubtitle} {...props} />;
}

export function SectionTitleText({ text, ...props }: { text: string } & Partial<StaggeredTextProps>) {
  return <StaggeredText text={text} {...textAnimationPresets.sectionTitle} {...props} />;
}
