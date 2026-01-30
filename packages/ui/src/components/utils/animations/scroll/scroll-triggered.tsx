'use client';

import type { BoxProps } from '@mui/material/Box';

import { useRef, useEffect, useState, useCallback } from 'react';
import { m, useAnimation, useInView } from 'framer-motion';
import { useColorScheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

interface ScrollTriggeredProps extends Omit<BoxProps, 'children'> {
  /** Children to animate */
  children: React.ReactNode;
  /** Animation preset */
  preset?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn' | 'flipIn';
  /** Animation duration in seconds */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Trigger threshold (0-1) */
  threshold?: number;
  /** Trigger only once or every time */
  triggerOnce?: boolean;
  /** Custom animation variants */
  variants?: {
    hidden: any;
    visible: any;
  };
  /** Stagger delay for child elements */
  staggerChildren?: number;
  /** Enable debug mode */
  debug?: boolean;
}

interface ScrollStaggerProps extends Omit<BoxProps, 'children'> {
  /** Children to stagger animate */
  children: React.ReactNode;
  /** Stagger delay between children */
  staggerDelay?: number;
  /** Animation preset for children */
  childPreset?: ScrollTriggeredProps['preset'];
  /** Threshold for triggering */
  threshold?: number;
  /** Trigger only once */
  triggerOnce?: boolean;
}

interface ScrollProgressShowcaseProps extends Omit<BoxProps, 'children'> {
  /** Children to render with progress */
  children?: React.ReactNode;
  /** Show progress bar */
  showProgressBar?: boolean;
  /** Progress bar height */
  progressHeight?: number;
  /** Progress bar color */
  progressColor?: string;
}

interface ScrollParallaxProps extends Omit<BoxProps, 'children'> {
  /** Children to apply parallax to */
  children: React.ReactNode;
  /** Parallax speed (-1 to 1) */
  speed?: number;
  /** Enable only on larger screens */
  enableOnMobile?: boolean;
}

// ----------------------------------------------------------------------
// Animation presets

const scrollAnimationPresets = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -10, scale: 0.9 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
  flipIn: {
    hidden: { opacity: 0, rotateY: -90, scale: 0.8 },
    visible: { opacity: 1, rotateY: 0, scale: 1 },
  },
};

// ----------------------------------------------------------------------

export function ScrollTriggered({
  children,
  preset = 'fadeIn',
  duration = 0.6,
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  variants,
  staggerChildren,
  debug = false,
  sx,
  ...other
}: ScrollTriggeredProps) {
  // Use custom variants or preset
  const animationVariants = variants || scrollAnimationPresets[preset];

  return (
    <Box
      component={m.div}
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once: triggerOnce, 
        amount: threshold,
        margin: "-50px"
      }}
      variants={{
        hidden: animationVariants.hidden,
        visible: {
          ...animationVariants.visible,
          transition: {
            duration,
            delay,
            ease: 'easeOut',
            ...(staggerChildren && {
              staggerChildren,
              delayChildren: delay,
            }),
          },
        },
      }}
      sx={[
        {
          ...(debug && {
            border: '2px dashed red',
            position: 'relative',
            '&::before': {
              content: '"SCROLL TRIGGER ACTIVE"',
              position: 'absolute',
              top: -20,
              left: 0,
              fontSize: '10px',
              fontWeight: 'bold',
              color: 'red',
              backgroundColor: 'white',
              padding: '2px 6px',
              borderRadius: 1,
              zIndex: 1000,
            },
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
// Staggered animations for multiple children

export function ScrollStagger({
  children,
  staggerDelay = 0.1,
  childPreset = 'slideUp',
  threshold = 0.1,
  triggerOnce = true,
  sx,
  ...other
}: ScrollStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: triggerOnce });
  const controls = useAnimation();

  const childVariants = scrollAnimationPresets[childPreset];

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [isInView, controls, triggerOnce]);

  return (
    <Box
      ref={ref}
      component={m.div}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      sx={sx}
      {...other}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <m.div
              key={index}
              variants={{
                hidden: childVariants.hidden,
                visible: {
                  ...childVariants.visible,
                  transition: {
                    duration: 0.6,
                    ease: 'easeOut',
                  },
                },
              }}
            >
              {child}
            </m.div>
          ))
        : children}
    </Box>
  );
}

// ----------------------------------------------------------------------
// Scroll progress indicator

export function ScrollProgressShowcase({
  children,
  showProgressBar = true,
  progressHeight = 4,
  progressColor,
  sx,
  ...other
}: ScrollProgressShowcaseProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { mode } = useColorScheme() || { mode: 'light' };

  const updateScrollProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    setScrollProgress(Math.min(Math.max(progress, 0), 100));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial calculation
    
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, [updateScrollProgress]);

  const defaultProgressColor = progressColor || (mode === 'dark' ? '#3b82f6' : '#1e40af');

  return (
    <Box sx={sx} {...other}>
      {showProgressBar && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: progressHeight,
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
          }}
        >
          <Box
            component={m.div}
            initial={{ width: '0%' }}
            animate={{ width: `${scrollProgress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
            sx={{
              height: '100%',
              backgroundColor: defaultProgressColor,
              borderRadius: '0 2px 2px 0',
            }}
          />
        </Box>
      )}
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------
// Parallax scrolling effect

export function ScrollParallax({
  children,
  speed = 0.5,
  enableOnMobile = false,
  sx,
  ...other
}: ScrollParallaxProps) {
  const [offsetY, setOffsetY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const handleScroll = useCallback(() => {
    setOffsetY(window.scrollY);
  }, []);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    if (enableOnMobile || !isMobile) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, [handleScroll, enableOnMobile, isMobile]);

  const shouldApplyParallax = enableOnMobile || !isMobile;

  return (
    <Box
      component={m.div}
      style={{
        transform: shouldApplyParallax ? `translateY(${offsetY * speed}px)` : undefined,
      }}
      sx={[
        {
          willChange: shouldApplyParallax ? 'transform' : 'auto',
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
// Specialized scroll components

export function ScrollFadeIn(props: Omit<ScrollTriggeredProps, 'preset'>) {
  return <ScrollTriggered preset="fadeIn" {...props} />;
}

export function ScrollSlideUp(props: Omit<ScrollTriggeredProps, 'preset'>) {
  return <ScrollTriggered preset="slideUp" {...props} />;
}

export function ScrollSlideDown(props: Omit<ScrollTriggeredProps, 'preset'>) {
  return <ScrollTriggered preset="slideDown" {...props} />;
}

export function ScrollSlideLeft(props: Omit<ScrollTriggeredProps, 'preset'>) {
  return <ScrollTriggered preset="slideLeft" {...props} />;
}

export function ScrollSlideRight(props: Omit<ScrollTriggeredProps, 'preset'>) {
  return <ScrollTriggered preset="slideRight" {...props} />;
}

export function ScrollScaleIn(props: Omit<ScrollTriggeredProps, 'preset'>) {
  return <ScrollTriggered preset="scaleIn" {...props} />;
}

export function ScrollRotateIn(props: Omit<ScrollTriggeredProps, 'preset'>) {
  return <ScrollTriggered preset="rotateIn" {...props} />;
}

export function ScrollFlipIn(props: Omit<ScrollTriggeredProps, 'preset'>) {
  return <ScrollTriggered preset="flipIn" {...props} />;
}

// ----------------------------------------------------------------------
// Advanced scroll components

export function ScrollRevealSection({
  children,
  title,
  subtitle,
  ...props
}: ScrollTriggeredProps & { title?: string; subtitle?: string }) {
  return (
    <ScrollTriggered preset="slideUp" duration={0.8} {...props}>
      {title && (
        <ScrollTriggered preset="fadeIn" delay={0.2}>
          <Box component="h2" sx={{ mb: 2, typography: 'h3' }}>
            {title}
          </Box>
        </ScrollTriggered>
      )}
      {subtitle && (
        <ScrollTriggered preset="fadeIn" delay={0.4}>
          <Box component="p" sx={{ mb: 4, typography: 'h6', color: 'text.secondary' }}>
            {subtitle}
          </Box>
        </ScrollTriggered>
      )}
      <ScrollTriggered preset="slideUp" delay={0.6}>
        {children}
      </ScrollTriggered>
    </ScrollTriggered>
  );
}

export function ScrollCountUp({
  from = 0,
  to,
  duration = 2,
  ...props
}: Omit<ScrollTriggeredProps, 'children'> & {
  from?: number;
  to: number;
  duration?: number;
}) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const increment = (to - from) / (duration * 60); // 60fps
      const timer = setInterval(() => {
        setCount((prev) => {
          const next = prev + increment;
          if (next >= to) {
            clearInterval(timer);
            return to;
          }
          return next;
        });
      }, 1000 / 60);

      return () => clearInterval(timer);
    }
  }, [isInView, from, to, duration]);

  return (
    <ScrollTriggered ref={ref} preset="scaleIn" {...props}>
      {Math.round(count).toLocaleString()}
    </ScrollTriggered>
  );
}

// ----------------------------------------------------------------------
// Usage examples and presets

export const scrollAnimationPresetExamples = {
  // Hero section reveal
  heroReveal: {
    preset: 'slideUp' as const,
    duration: 1,
    delay: 0.2,
    threshold: 0.1,
  },
  
  // Feature cards stagger
  featureStagger: {
    staggerDelay: 0.15,
    childPreset: 'slideUp' as const,
    threshold: 0.2,
  },
  
  // Statistics counter
  statsCounter: {
    preset: 'scaleIn' as const,
    duration: 0.8,
    threshold: 0.5,
  },
  
  // Testimonial reveal
  testimonialReveal: {
    preset: 'fadeIn' as const,
    duration: 0.8,
    delay: 0.1,
    threshold: 0.3,
  },
  
  // CTA section
  ctaReveal: {
    preset: 'slideUp' as const,
    duration: 0.8,
    delay: 0.2,
    threshold: 0.2,
  },
};

// ----------------------------------------------------------------------
// Easy preset components

export function HeroScrollReveal(props: Omit<ScrollTriggeredProps, keyof typeof scrollAnimationPresetExamples.heroReveal>) {
  return <ScrollTriggered {...scrollAnimationPresetExamples.heroReveal} {...props} />;
}

export function FeatureScrollStagger(props: Omit<ScrollStaggerProps, keyof typeof scrollAnimationPresetExamples.featureStagger>) {
  return <ScrollStagger {...scrollAnimationPresetExamples.featureStagger} {...props} />;
}

export function StatsScrollCounter(props: Omit<ScrollTriggeredProps, keyof typeof scrollAnimationPresetExamples.statsCounter>) {
  return <ScrollTriggered {...scrollAnimationPresetExamples.statsCounter} {...props} />;
}

export function TestimonialScrollReveal(props: Omit<ScrollTriggeredProps, keyof typeof scrollAnimationPresetExamples.testimonialReveal>) {
  return <ScrollTriggered {...scrollAnimationPresetExamples.testimonialReveal} {...props} />;
}

export function CtaScrollReveal(props: Omit<ScrollTriggeredProps, keyof typeof scrollAnimationPresetExamples.ctaReveal>) {
  return <ScrollTriggered {...scrollAnimationPresetExamples.ctaReveal} {...props} />;
}
