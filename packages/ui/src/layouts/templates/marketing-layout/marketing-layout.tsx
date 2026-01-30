'use client';

import type { Breakpoint } from '@mui/material/styles';
import type { MarketingContentProps } from './content';
import type { MainSectionProps, LayoutSectionProps, HeaderSectionProps } from '../../core';

import { merge } from 'es-toolkit';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { MarketingContent } from './content';
import { MainSection, LayoutSection, HeaderSection } from '../../core';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export interface MarketingLayoutProps extends LayoutBaseProps {
  // Header content (app-specific)
  logo?: React.ReactNode;
  headerActions?: React.ReactNode;
  
  // Content options
  contentMaxWidth?: number;
  contentCentered?: boolean;
  
  // Footer
  footerContent?: React.ReactNode;
  
  // Layout behavior
  headerSticky?: boolean;
  headerElevation?: boolean;
  headerBgOpacity?: number;
  headerBgTransitionOpacity?: number;
  headerBgVisible?: boolean;
  
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
    content?: MarketingContentProps & { compact?: boolean };
  };
}

export function MarketingLayout({
  sx,
  cssVars,
  children,
  logo,
  headerActions,
  footerContent,
  headerSticky = true,
  headerElevation = false,
  headerBgOpacity,
  headerBgTransitionOpacity,
  headerBgVisible = true,
  slotProps,
  layoutQuery = 'md',
}: MarketingLayoutProps) {

  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: { maxWidth: false },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      leftArea: logo,
      rightArea: headerActions,
    };

    return (
      <HeaderSection
        //       disableOffset={false}
        // disableElevation={isNavVertical}
        disableOffset={false}
        disableElevation={!headerElevation}
        bgOpacity={headerBgOpacity}
        bgTransitionOpacity={headerBgTransitionOpacity}
        bgVisible={headerBgVisible}
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={[
          headerSticky && { position: { [layoutQuery]: 'sticky' } },
          { minHeight: '72px', maxHeight: '72px' }, // Force normal header height
          ...(Array.isArray(slotProps?.header?.sx) ? slotProps.header.sx : [slotProps?.header?.sx]),
        ]}
      />
    );
  };

  const renderMain = () => {
    const { compact, ...restContentProps } = slotProps?.content ?? {};

    return (
      <MainSection {...slotProps?.main}>
        <MarketingContent layoutQuery={layoutQuery} {...restContentProps}>
          {children}
        </MarketingContent>
      </MainSection>
    );
  };

  const renderFooter = () => footerContent || null;

  return (
    <LayoutSection
      headerSection={renderHeader()}
      footerSection={renderFooter()}
      cssVars={cssVars}
      sx={sx}
    >
      {renderMain()}
    </LayoutSection>
  );
}
