'use client';

import type { Breakpoint } from '@mui/material/styles';
import type { NavSectionProps } from '../../../components/navigation/navigation-menu';
import type { MainSectionProps, LayoutSectionProps, HeaderSectionProps } from '../../core';

import { merge } from 'es-toolkit';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';

import { MainSection, layoutClasses, HeaderSection, LayoutSection } from '../../core';
import { MenuButton } from '../../../components/layout/menu-button';
import { NavMobile } from './components/nav-mobile';
import { NavVertical } from './components/nav-vertical';
import { NavHorizontal } from './components/nav-horizontal';
import { dashboardLayoutVars, dashboardNavColorVars, type NavColor, type NavLayout } from './css-vars';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type DashboardLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  navLayout?: NavLayout;
  navColor?: NavColor;
  navData: NavSectionProps['data'];
  pathname?: string;
  infoCard?: {
    title: string;
    subtitle: string;
    icon?: string;
    variant?: 'solid' | 'glassmorphism-light' | 'glassmorphism-dark' | 'transparent';
  };
  
  // State handlers
  navOpen?: boolean;
  onNavOpen?: () => void;
  onNavClose?: () => void;
  onNavToggle?: () => void;
  
  // Permission check
  checkPermissions?: NavSectionProps['checkPermissions'];
  
  // Slots for customization
  slots?: {
    header?: {
      topArea?: React.ReactNode;
      leftArea?: React.ReactNode;
      rightArea?: React.ReactNode;
      bottomArea?: React.ReactNode;
    };
    nav?: {
      topArea?: React.ReactNode;
      bottomArea?: React.ReactNode;
    };
  };
  
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
    // RouterLink component for React Router navigation (prevents hard page refreshes)
    RouterLink?: React.ComponentType<any>;
  };
};

export function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  slots,
  navData,
  pathname,
  infoCard,
  navOpen = false,
  onNavOpen = () => {},
  onNavClose = () => {},
  onNavToggle = () => {},
  navLayout = 'vertical',
  navColor = 'integrate',
  checkPermissions,
  layoutQuery = 'lg',
}: DashboardLayoutProps) {
  const theme = useTheme();

  const navVars = dashboardNavColorVars(theme, navColor, navLayout);

  const isNavMini = navLayout === 'mini';
  const isNavHorizontal = navLayout === 'horizontal';
  const isNavVertical = isNavMini || navLayout === 'vertical';

  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: false,
        sx: {
          ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
          ...(isNavHorizontal && {
            bgcolor: 'var(--layout-nav-bg)',
            height: { [layoutQuery]: 'var(--layout-nav-horizontal-height)' },
            [`& .${iconButtonClasses.root}`]: { color: 'var(--layout-nav-text-secondary-color)' },
          }),
        },
      },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: slots?.header?.topArea,
      bottomArea: isNavHorizontal ? (
        <NavHorizontal
          data={navData}
          layoutQuery={layoutQuery}
          cssVars={navVars.section}
          checkPermissions={checkPermissions}
          RouterLink={slotProps?.RouterLink}
        />
      ) : slots?.header?.bottomArea,
      leftArea: (
        <>
          <MenuButton
            onClick={onNavOpen}
            sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
          />
          <NavMobile
            data={navData}
            open={navOpen}
            onClose={onNavClose}
            pathname={pathname}
            cssVars={navVars.section}
            checkPermissions={checkPermissions}
            slots={slots?.nav}
            RouterLink={slotProps?.RouterLink}
          />
          {slots?.header?.leftArea}
        </>
      ),
      rightArea: slots?.header?.rightArea,
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        disableOffset={false}
        disableElevation={isNavVertical}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderSidebar = () => (
    <NavVertical
      data={navData}
      isNavMini={isNavMini}
      layoutQuery={layoutQuery}
      cssVars={navVars.section}
      infoCard={infoCard}
      checkPermissions={checkPermissions}
      onToggleNav={onNavToggle}
      slots={slots?.nav}
      RouterLink={slotProps?.RouterLink}
    />
  );

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      headerSection={renderHeader()}
      sidebarSection={isNavHorizontal ? null : renderSidebar()}
      cssVars={{ ...dashboardLayoutVars(theme), ...navVars.layout, ...cssVars }}
      sx={[
        {
          [`& .${layoutClasses.sidebarContainer}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              pl: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
              transition: theme.transitions.create(['padding-left'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}
