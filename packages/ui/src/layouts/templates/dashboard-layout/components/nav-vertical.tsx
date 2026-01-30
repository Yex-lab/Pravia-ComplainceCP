'use client';
import type { Breakpoint } from '@mui/material/styles';
import type { NavSectionProps } from '../../../../components/navigation/navigation-menu';

import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import { layoutClasses } from '../../../core';
import { BrandLogo } from '../../../../components/data-display/logo';
import { Scrollbar } from '../../../../components/navigation/scrollbar';
import { NavToggleButton } from '../../../../components/layout/nav-toggle-button';
import { NavSectionMini, NavSectionVertical } from '../../../../components/navigation/navigation-menu';
import { InfoCard } from './info-card';

// ----------------------------------------------------------------------

export type NavVerticalProps = React.ComponentProps<'div'> &
  NavSectionProps & {
    isNavMini: boolean;
    layoutQuery?: Breakpoint;
    onToggleNav: () => void;
    // RouterLink component for React Router navigation
    RouterLink?: React.ComponentType<any>;
    infoCard?: {
      title: string;
      subtitle: string;
      icon?: string;
      variant?: 'solid' | 'glassmorphism-light' | 'glassmorphism-dark' | 'transparent';
    };
    slots?: {
      topArea?: React.ReactNode;
      bottomArea?: React.ReactNode;
    };
  };

export function NavVertical({
  sx,
  data,
  slots,
  cssVars,
  className,
  isNavMini,
  onToggleNav,
  infoCard,
  checkPermissions,
  RouterLink,
  layoutQuery = 'md',
  ...other
}: NavVerticalProps) {
  const renderNavVertical = () => (
    <>
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
          <BrandLogo LinkComponent={RouterLink} isSingle={false} />
        </Box>
      )}

      {infoCard && (
        <InfoCard
          title={infoCard.title}
          subtitle={infoCard.subtitle}
          icon={infoCard.icon}
          variant={infoCard.variant}
          isNavMini={false}
        />
      )}

      <Scrollbar fillContent>
        <NavSectionVertical
          data={data}
          cssVars={cssVars}
          usePrimaryColor
          checkPermissions={checkPermissions}
          RouterLink={RouterLink}
          sx={{ px: 2, flex: '1 1 auto' }}
        />
      </Scrollbar>
    </>
  );

  const renderNavMini = () => (
    <>
      {slots?.topArea ?? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5 }}>
          <BrandLogo LinkComponent={RouterLink} isSingle />
        </Box>
      )}

      {infoCard && (
        <InfoCard
          title={infoCard.title}
          subtitle={infoCard.subtitle}
          icon={infoCard.icon}
          variant={infoCard.variant}
          isNavMini={true}
        />
      )}

      <NavSectionMini
        data={data}
        cssVars={cssVars}
        hideLabels
        checkPermissions={checkPermissions}
        RouterLink={RouterLink}
        sx={[
          (theme) => ({
            ...theme.mixins.hideScrollY,
            pb: 2,
            px: 0.5,
            flex: '1 1 auto',
            overflowY: 'auto',
          }),
        ]}
      />

      {slots?.bottomArea}
    </>
  );

  return (
    <NavRoot
      isNavMini={isNavMini}
      layoutQuery={layoutQuery}
      className={mergeClasses([layoutClasses.nav.root, layoutClasses.nav.vertical, className])}
      sx={sx}
      {...other}
    >
      <NavToggleButton
        isNavMini={isNavMini}
        onClick={onToggleNav}
        sx={[
          (theme) => ({
            display: 'none',
            [theme.breakpoints.up(layoutQuery)]: { display: 'inline-flex' },
          }),
        ]}
      />
      {isNavMini ? renderNavMini() : renderNavVertical()}
    </NavRoot>
  );
}

// ----------------------------------------------------------------------

const NavRoot = styled('div', {
  shouldForwardProp: (prop: string) => !['isNavMini', 'layoutQuery', 'sx'].includes(prop),
})<Pick<NavVerticalProps, 'isNavMini' | 'layoutQuery'>>(
  ({ isNavMini, layoutQuery = 'md', theme }) => ({
    top: 0,
    left: 0,
    height: '100%',
    display: 'none',
    position: 'fixed',
    flexDirection: 'column',
    zIndex: 'var(--layout-nav-zIndex)',
    backgroundColor: 'var(--layout-nav-bg)',
    width: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
    borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
    transition: theme.transitions.create(['width'], {
      easing: 'var(--layout-transition-easing)',
      duration: 'var(--layout-transition-duration)',
    }),
    [theme.breakpoints.up(layoutQuery)]: { display: 'flex' },
  })
);
