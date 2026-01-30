'use client';

import type { Breakpoint } from '@mui/material/styles';
import type { MainSectionProps, LayoutSectionProps, HeaderSectionProps } from '../../core';

import { merge } from 'es-toolkit';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { Footer } from './footer';
import { LayoutSection } from '../../core/layout-section';
import { HeaderSection } from '../../core/header-section';
import { MainSection } from '../../core/main-section';
import { CenteredContent, SplitContent } from './components';

// ----------------------------------------------------------------------

type LayoutBaseProps = LayoutSectionProps & {
  cssVars?: Record<string, any>;
};

export interface FormLayoutProps extends LayoutBaseProps {
  variant: 'centered' | 'split';
  
  // Header content (app-specific)
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  
  // Split variant content
  sideContent?: React.ReactNode;
  
  // Styling options
  formMaxWidth?: string;
  backgroundImage?: string;
  headerBgOpacity?: number;
  headerBgTransitionOpacity?: number;
  headerBgVisible?: boolean;
  
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
  };
}

export function FormLayout({
  sx,
  cssVars,
  children,
  variant,
  headerLeft,
  headerRight,
  sideContent,
  formMaxWidth = '600px',
  backgroundImage,
  headerBgOpacity,
  headerBgTransitionOpacity,
  headerBgVisible = true,
  slotProps,
  layoutQuery = 'md',
}: FormLayoutProps) {

  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = { container: { maxWidth: false } };

    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: headerLeft,
      rightArea: headerRight,
    };

    return (
      <HeaderSection
        disableElevation
        bgOpacity={headerBgOpacity}
        bgTransitionOpacity={headerBgTransitionOpacity}
        bgVisible={headerBgVisible}
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={[
          { position: { [layoutQuery]: 'fixed' } },
          ...(Array.isArray(slotProps?.header?.sx) ? slotProps.header.sx : [slotProps?.header?.sx]),
        ]}
      />
    );
  };

  const renderContent = () => {
    if (variant === 'centered') {
      return <CenteredContent>{children}</CenteredContent>;
    }

    if (variant === 'split') {
      return <SplitContent sideContent={sideContent}>{children}</SplitContent>;
    }

    return null;
  };

  const renderMain = () => (
    <MainSection
      {...slotProps?.main}
      sx={[
        (theme) => ({
          alignItems: 'center',
          p: theme.spacing(3, 2, 10, 2),
          [theme.breakpoints.up(layoutQuery)]: {
            justifyContent: 'center',
            p: theme.spacing(10, 0, 10, 0),
            ...(variant === 'split' && { flexDirection: 'row' }),
          },
        }),
        ...(Array.isArray(slotProps?.main?.sx) ? slotProps.main.sx : [slotProps?.main?.sx]),
      ]}
    >
      {renderContent()}
    </MainSection>
  );

  return (
    <LayoutSection
      sx={[
        (theme) => ({
          position: 'relative',
          '&::before': backgroundImage ? {
            ...theme.mixins.bgGradient({
              images: [`url(${backgroundImage})`],
            }),
            zIndex: -1,
            opacity: 0.24,
            width: '100%',
            height: '100%',
            content: "''",
            position: 'absolute',
            ...theme.applyStyles('dark', {
              opacity: 0.08,
            }),
          } : {},
          ...cssVars,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      cssVars={{ '--layout-auth-content-width': formMaxWidth, ...cssVars }}
    >
      {renderHeader()}
      {renderMain()}
      <Footer layoutQuery={layoutQuery} />
    </LayoutSection>
  );
}
