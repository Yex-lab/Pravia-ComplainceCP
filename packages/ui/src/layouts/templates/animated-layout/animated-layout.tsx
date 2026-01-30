'use client';

import type { SxProps, Theme } from '@mui/material/styles';
import type { BasicHeaderSectionProps } from '../../core';

import Box from '@mui/material/Box';

import { BasicHeaderSection } from '../../core';
import { GradientBackground } from '../../../components/utils/animations';

// ----------------------------------------------------------------------

export interface AnimatedLayoutProps {
  children: React.ReactNode;
  
  // Header props
  logo?: React.ReactNode;
  headerActions?: React.ReactNode;
  headerBgOpacity?: number;
  headerBgVisible?: boolean;
  headerSticky?: boolean;
  
  // Gradient background props
  gradientVariant?: 'hero' | 'section' | 'minimal';
  gradientAnimated?: boolean;
  
  // Background animations
  backgroundAnimations?: React.ReactNode;
  
  // Styling
  sx?: SxProps<Theme>;
}

export function AnimatedLayout({
  children,
  logo,
  headerActions,
  headerBgOpacity = 0.8,
  headerBgVisible = true,
  headerSticky = true,
  gradientVariant = 'hero',
  gradientAnimated = true,
  backgroundAnimations,
  sx,
}: AnimatedLayoutProps) {
  const renderBackgroundAnimations = () => {
    if (!backgroundAnimations) return null;
    
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {backgroundAnimations}
      </Box>
    );
  };

  return (
    <GradientBackground 
      variant={gradientVariant} 
      animated={gradientAnimated}
      sx={[
        {
          minHeight: '100vh',
          maxHeight: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Background animations */}
      {renderBackgroundAnimations()}

      {/* Header */}
      <BasicHeaderSection
        leftArea={logo}
        rightArea={headerActions}
        bgOpacity={headerBgOpacity}
        bgVisible={headerBgVisible}
        sticky={headerSticky}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {children}
      </Box>
    </GradientBackground>
  );
}
