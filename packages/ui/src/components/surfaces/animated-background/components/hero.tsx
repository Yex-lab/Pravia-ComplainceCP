'use client';

import { useRef, useState } from 'react';
import { m, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import type { MotionValue, SpringOptions } from 'framer-motion';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';

import { Iconify } from '../../../data-display/iconify';
import { StandardNeuralNetwork, HeroParticles, HeroMorphingShape, BackgroundMorphingElement, CtaLiquidButton, GradientBackground, AnimatedGradientText, StatCounter, StaggeredText } from '../../../utils/animations';

// ----------------------------------------------------------------------

interface HeroData {
  title: string;
  highlightText: string;
  subtitle: string;
  description: string;
  tagline?: string;
  buttons: Array<{
    text: string;
    icon?: string;
    variant?: 'primary' | 'secondary';
  }>;
}

interface StatData {
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
}

// ----------------------------------------------------------------------

export function Hero({
  title,
  highlightText,
  subtitle,
  description,
  tagline,
  buttons,
  stats
}: HeroData & { stats?: StatData[] }) {
  const { mode } = useColorScheme() || { mode: 'light' };
  const scrollProgress = useScrollPercent();
  
  const y1 = useTransformY(scrollProgress.scrollY, scrollProgress.percent * -2);
  const y2 = useTransformY(scrollProgress.scrollY, scrollProgress.percent * -1.5);

  return (
    <GradientBackground variant="hero" animated ref={scrollProgress.elementRef}>
      {/* Floating Elements */}
      <StandardNeuralNetwork />
      <HeroParticles />
      <HeroMorphingShape /> 
      <BackgroundMorphingElement />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Stack spacing={6} sx={{ textAlign: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <StaggeredText
              text={title}
              variant="h1"
              animationType="fadeUp"
              animationUnit="word"
              staggerDelay={0.15}
              duration={0.3}
              parallaxY={y1}
              sx={{ 
                fontWeight: 700, 
                maxWidth: 800, 
                mx: 'auto',
                display: 'inline',
              }}
            />
            
            <AnimatedGradientText
              text={highlightText}
              variant="h1"
              colors={['primary.main', 'secondary.main', 'primary.main', 'secondary.main', 'primary.main']}
              gradientAngle={300}
              animationDuration={20}
              animationDelay={1.8}
              sx={{
                fontWeight: 700,
                display: 'inline',
              }}
            />
          </Box>
          
          <StaggeredText
            text={subtitle}
            variant="h5"
            delay={1}
            staggerDelay={0.08}
            parallaxY={y2}
            sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', mb: 2 }}
          />
          
          <StaggeredText
            text={description}
            variant="h6"
            delay={2.5}
            staggerDelay={0.06}
            sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto', fontWeight: 400 }}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
            {buttons.map((button, index) => (
              <CtaLiquidButton
                key={index}
                startIcon={button.icon ? <Iconify icon={button.icon as any} width={24} /> : undefined}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {button.text}
              </CtaLiquidButton>
            ))}
          </Stack>

          {tagline && (
            <Typography
              variant="body1"
              component={m.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4, duration: 0.6 }}
              sx={{ 
                color: 'text.secondary', 
                mt: 3,
                fontStyle: 'italic',
                maxWidth: 500,
                mx: 'auto',
              }}
            >
              {tagline}
            </Typography>
          )}

          {stats && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={4}
              sx={{ justifyContent: 'center', mt: 8 }}
            >
              {stats.map((stat, index) => (
                <StatCounter
                  key={index}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  delay={0.2 + index * 0.2}
                  decimals={stat.decimals}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    </GradientBackground>
  );
}

// ----------------------------------------------------------------------
// Helper functions

function useTransformY(value: MotionValue<number>, distance: number) {
  const physics: SpringOptions = {
    mass: 0.1,
    damping: 20,
    stiffness: 300,
    restDelta: 0.001,
  };

  return useSpring(useTransform(value, [0, 1], [0, distance]), physics);
}

function useScrollPercent() {
  const elementRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [percent, setPercent] = useState(0);

  useMotionValueEvent(scrollY, 'change', (scrollHeight) => {
    let heroHeight = 0;

    if (elementRef.current) {
      heroHeight = elementRef.current.offsetHeight;
    }

    const scrollPercent = Math.floor((scrollHeight / heroHeight) * 100);

    if (scrollPercent >= 100) {
      setPercent(100);
    } else {
      setPercent(Math.floor(scrollPercent));
    }
  });

  return { elementRef, percent, scrollY };
}
