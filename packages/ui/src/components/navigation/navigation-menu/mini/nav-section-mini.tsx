'use client';

import type { NavGroupProps, NavSectionProps } from '../types';

import { useTheme } from '@mui/material/styles';

import { NavList } from './nav-list';
import { Nav, NavUl, NavLi } from '../components';
import { navSectionClasses, navSectionCssVars } from '../styles';

// ----------------------------------------------------------------------

function mergeClasses(classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ----------------------------------------------------------------------

export function NavSectionMini({
  sx,
  data,
  render,
  className,
  slotProps,
  hideLabels = false,
  checkPermissions,
  enabledRootRedirect,
  RouterLink,
  cssVars: overridesVars,
  ...other
}: NavSectionProps) {
  const theme = useTheme();

  const cssVars = { ...navSectionCssVars.mini(theme), ...overridesVars };

  return (
    <Nav
      className={mergeClasses([navSectionClasses.mini, className, hideLabels ? 'hide-labels' : undefined])}
      style={cssVars as React.CSSProperties}
      sx={[
        hideLabels && {
          '& .nav__item__icon': {
            width: 28,
            height: 28,
            margin: 0,
          },
          '& .nav__item__root': {
            minHeight: 56,
            padding: '14px 8px',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)' }}>
        {data.map((group) => (
          <Group
            key={group.subheader ?? group.items[0].title}
            render={render}
            cssVars={cssVars}
            items={group.items}
            slotProps={slotProps}
            hideLabels={hideLabels}
            checkPermissions={checkPermissions}
            enabledRootRedirect={enabledRootRedirect}
            RouterLink={RouterLink}
          />
        ))}
      </NavUl>
    </Nav>
  );
}

// ----------------------------------------------------------------------

function Group({
  items,
  render,
  cssVars,
  slotProps,
  hideLabels,
  checkPermissions,
  enabledRootRedirect,
  RouterLink,
}: NavGroupProps & { hideLabels?: boolean }) {
  return (
    <NavLi>
      <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
        {items.map((list) => (
          <NavList
            key={list.title}
            depth={1}
            data={list}
            render={render}
            cssVars={cssVars}
            slotProps={slotProps}
            hideLabels={hideLabels}
            checkPermissions={checkPermissions}
            enabledRootRedirect={enabledRootRedirect}
            RouterLink={RouterLink}
          />
        ))}
      </NavUl>
    </NavLi>
  );
}
