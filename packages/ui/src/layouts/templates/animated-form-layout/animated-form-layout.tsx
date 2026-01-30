'use client';

import type { SxProps, Theme } from '@mui/material/styles';

import Box from '@mui/material/Box';

import { BasicHeaderSection } from '../../core';
import { GradientBackground } from '../../../components/utils/animations';
import { CenteredContent } from './components/centered-content';
import { SplitContent } from './components/split-content';

// ----------------------------------------------------------------------

export interface AnimatedFormLayoutProps {
  children: React.ReactNode;
  variant: 'centered' | 'split';
  contentVariant?: 'solid' | 'glassmorphism-light' | 'glassmorphism-dark' | 'transparent';

  // Header props
  logo?: React.ReactNode;
  headerActions?: React.ReactNode;
  headerBgOpacity?: number;
  headerBgVisible?: boolean;
  headerSticky?: boolean;

  // Form content props
  sideContent?: React.ReactNode;
  formMaxWidth?: string;
  contentOffset?: string;

  // Gradient background props
  gradientVariant?: 'hero' | 'section' | 'minimal';
  gradientAnimated?: boolean;

  // Background animations
  backgroundAnimations?: React.ReactNode;

  // Styling
  sx?: SxProps<Theme>;
}

export function AnimatedFormLayout({
  children,
  variant,
  contentVariant = 'glassmorphism-light',
  logo,
  headerActions,
  headerBgOpacity = 0.8,
  headerBgVisible = true,
  headerSticky = true,
  sideContent,
  formMaxWidth = '600px',
  contentOffset = '0px',
  gradientVariant = 'hero',
  gradientAnimated = true,
  backgroundAnimations,
  sx,
}: AnimatedFormLayoutProps) {
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

  const renderContent = () => {
    if (variant === 'centered') {
      return <CenteredContent maxWidth={formMaxWidth} variant={contentVariant} contentOffset={contentOffset}>{children}</CenteredContent>;
    }

    return (
      <SplitContent sideContent={sideContent} formMaxWidth={formMaxWidth} variant={contentVariant} contentOffset={contentOffset}>
        {children}
      </SplitContent>
    );
  };

  return (
    <GradientBackground 
      variant={gradientVariant} 
      animated={gradientAnimated}
      sx={[
        {
          minHeight: '100vh',
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
        {renderContent()}
      </Box>
    </GradientBackground>
  );
}
