// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useColorScheme } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom'; 
import { Iconify } from '../../data-display/iconify';
interface ScrollToTopFabProps {
  /** Show FAB when user scrolls past this percentage of page */
  showAtPercentage?: number;
  /** Animation duration for scroll to top */
  scrollDuration?: number;
  /** FAB size */
  size?: 'small' | 'medium' | 'large';
  /** Custom icon */
  icon?: string;
}

export function ScrollToTopFab({
  showAtPercentage = 75,
  scrollDuration = 800,
  size = 'large',
  icon = 'solar:double-alt-arrow-up-bold'
}: ScrollToTopFabProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { mode } = useColorScheme() || { mode: 'light' };

  // Check scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = document.documentElement.scrollTop;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrolled / maxHeight) * 100;
      
      setIsVisible(scrollPercentage > showAtPercentage);
    };

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // Check initial position

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [showAtPercentage]);

  // Smooth scroll to top
  const scrollToTop = () => {
    const startPosition = window.scrollY;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / scrollDuration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      window.scrollTo(0, startPosition * (1 - easeOut));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <Zoom in={isVisible} timeout={300}>
      <Fab
        onClick={scrollToTop}
        size={size}
        color="primary"
        aria-label="scroll to top"
        sx={{
          position: 'fixed',
          bottom: 124, // 24px + 100px = 124px from bottom
          right: 24,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.05)',
          },
          '&:active': {
            transform: 'translateY(0) scale(0.98)',
          },
        }}
      >
        <Iconify 
          icon={icon} 
          width={size === 'large' ? 28 : size === 'medium' ? 24 : 20} 
        />
      </Fab>
    </Zoom>
  );
}

// Preset variations
export function AIThemedScrollToTopFab(props: Omit<ScrollToTopFabProps, 'icon'>) {
  return <ScrollToTopFab icon="solar:rocket-bold" {...props} />;
}

export function MinimalScrollToTopFab(props: ScrollToTopFabProps) {
  const { mode } = useColorScheme() || { mode: 'light' };
  
  return (
    <ScrollToTopFab
      {...props}
      sx={{
        background: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
        color: mode === 'dark' ? 'white' : 'black',
        '&:hover': {
          background: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        },
      }}
    />
  );
}
