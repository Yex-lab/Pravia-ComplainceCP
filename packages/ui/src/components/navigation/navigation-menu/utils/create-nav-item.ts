import type { NavItemDataProps, NavItemOptionsProps } from '../types';

import React, { cloneElement } from 'react';

import { Iconify, type IconifyName } from '../../../data-display/iconify';

// ----------------------------------------------------------------------

type CreateNavItemReturn = {
  subItem: boolean;
  rootItem: boolean;
  subDeepItem: boolean;
  baseProps: Record<string, any>;
  renderIcon: React.ReactNode;
  renderInfo: React.ReactNode;
};

type CreateNavItemProps = Pick<NavItemDataProps, 'path' | 'icon' | 'info'> & 
  NavItemOptionsProps & {
    // RouterLink component for React Router navigation
    RouterLink?: React.ComponentType<any>;
  };

export function createNavItem({
  path,
  icon,
  info,
  depth,
  render,
  hasChild,
  externalLink,
  enabledRootRedirect,
  RouterLink,
}: CreateNavItemProps): CreateNavItemReturn {
  const rootItem = depth === 1;
  const subItem = !rootItem;
  const subDeepItem = Number(depth) > 2;

  // Use RouterLink for internal navigation, regular anchor for external links
  const linkProps = externalLink
    ? { href: path, target: '_blank', rel: 'noopener noreferrer' }
    : RouterLink 
      ? { component: RouterLink, href: path }
      : { href: path };

  // If item has children and root redirect is disabled, render as div instead of link
  const baseProps = hasChild && !enabledRootRedirect ? { component: 'div' } : linkProps;

  /**
   * Render @icon
   */
  let renderIcon = null;

  if (icon && render?.navIcon && typeof icon === 'string') {
    renderIcon = render?.navIcon[icon];
  } else if (icon && typeof icon === 'string') {
    // If icon is a string but no custom render provided, wrap it in Iconify
    renderIcon = React.createElement(Iconify, { icon: icon as IconifyName, width: 24 });
  } else {
    renderIcon = icon;
  }

  /**
   * Render @info
   */
  let renderInfo = null;

  if (info && render?.navInfo && Array.isArray(info)) {
    const [key, value] = info;
    const element = render.navInfo(value)[key];

    renderInfo = element ? cloneElement(element) : null;
  } else if (info && Array.isArray(info)) {
    // If info is an array but no custom render function, just display the first value
    renderInfo = info[0];
  } else {
    renderInfo = info;
  }

  return {
    subItem,
    rootItem,
    subDeepItem,
    baseProps,
    renderIcon,
    renderInfo,
  };
}
