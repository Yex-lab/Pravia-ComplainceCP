'use client';
"use client";

import React, { useState, useCallback } from 'react';
import {
  Drawer,
  Box,
  Collapse,
  ButtonBase,
  Typography,
  styled,
  alpha,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Scrollbar } from '../../navigation/scrollbar';

export interface NavigationItem {
  id: string;
  title: string;
  path?: string;
  icon?: React.ReactNode;
  info?: string;
  disabled?: boolean;
  children?: NavigationItem[];
}

export interface NavigationSection {
  subheader?: string;
  items: NavigationItem[];
}

export interface NavigationTheme {
  backgroundColor?: string;
  textColor?: string;
  activeColor?: string;
  hoverColor?: string;
  subheaderColor?: string;
}

export interface NavigationDrawerProps {
  data: NavigationSection[];
  collapsed?: boolean;
  width?: number;
  collapsedWidth?: number;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  currentPath?: string;
  theme?: NavigationTheme;
}

const StyledDrawer = styled(Drawer)<{ navTheme?: NavigationTheme }>(({ theme, navTheme }) => {
  // Auto-detect theme mode and set appropriate defaults
  const isDark = theme.palette.mode === 'dark';
  const backgroundColor = navTheme?.backgroundColor || (isDark ? theme.palette.grey[900] : theme.palette.grey[100]);
  const textColor = navTheme?.textColor || (isDark ? theme.palette.common.white : theme.palette.grey[800]);
  const activeColor = navTheme?.activeColor || theme.palette.primary.main;
  const hoverColor = navTheme?.hoverColor || (isDark ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.common.black, 0.04));
  const subheaderColor = navTheme?.subheaderColor || theme.palette.text.disabled;

  return {
    '& .MuiDrawer-paper': {
      backgroundColor,
      color: textColor,
      borderRight: `1px solid ${theme.palette.divider}`,
      // CSS Variables for nav styling
      '--nav-item-color': textColor,
      '--nav-item-hover-bg': hoverColor,
      '--nav-item-caption-color': theme.palette.text.disabled,
      // root
      '--nav-item-root-height': '44px',
      '--nav-item-root-active-color': isDark ? theme.palette.primary.light : activeColor,
      '--nav-item-root-active-bg': alpha(activeColor, isDark ? 0.12 : 0.08),
      '--nav-item-root-active-hover-bg': alpha(activeColor, isDark ? 0.20 : 0.16),
      '--nav-item-root-open-color': textColor,
      '--nav-item-root-open-bg': hoverColor,
      // sub
      '--nav-item-sub-height': '36px',
      '--nav-item-sub-active-color': textColor,
      '--nav-item-sub-active-bg': hoverColor,
      '--nav-item-sub-open-color': textColor,
      '--nav-item-sub-open-bg': hoverColor,
      // spacing
      '--nav-item-gap': '4px',
      '--nav-item-radius': `${theme.shape.borderRadius}px`,
      '--nav-item-pt': '4px',
      '--nav-item-pr': '8px',
      '--nav-item-pb': '4px',
      '--nav-item-pl': '12px',
      '--nav-icon-size': '24px',
      '--nav-icon-margin': '0 12px 0 0',
      '--nav-subheader-color': subheaderColor,
      // bullet
      '--nav-bullet-size': '12px',
      '--nav-bullet-light-color': isDark ? '#4A5568' : '#CBD5E0',
      '--nav-bullet-dark-color': isDark ? '#2D3748' : '#A0AEC0',
    },
    // SimpleBar auto-hide styles
    '& .simplebar-scrollbar': {
      '&:before': {
        backgroundColor: theme.palette.text.disabled,
        opacity: 0,
        transition: 'opacity 0.2s ease-in-out',
      },
      '&.simplebar-visible:before': {
        opacity: 0.48,
      },
    },
    '&:hover .simplebar-scrollbar:before': {
      opacity: 0.48,
    },
  };
});

const StyledNavItem = styled(ButtonBase)<{ 
  depth: number; 
  active?: boolean; 
  hasChildren?: boolean;
  open?: boolean;
}>(({ theme, depth, active, hasChildren, open }) => {
  return {
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    borderRadius: '8px',
    margin: '2px 8px',
    minHeight: depth === 0 ? '44px' : '36px',
    // Simple, clear indentation
    paddingTop: '4px',
    paddingBottom: '4px', 
    paddingRight: '8px',
    paddingLeft: depth === 0 ? '12px' : '48px', // Much more indentation for children
    color: 'var(--nav-item-color)',
    fontSize: '0.875rem',
    fontWeight: active ? 600 : 400,
    transition: 'all 0.2s ease-in-out',
    
    // Add simple bullet for child items
    ...(depth > 0 && {
      '&::before': {
        content: '""',
        position: 'absolute',
        left: '28px',
        top: '50%',
        width: '4px',
        height: '4px',
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[500] : theme.palette.grey[400],
        borderRadius: '50%',
        transform: 'translateY(-50%)',
      },
    }),
    
    '&:hover': {
      backgroundColor: 'var(--nav-item-hover-bg)',
    },
    
    // Root item styles
    ...(depth === 0 && {
      ...(open && {
        backgroundColor: 'var(--nav-item-root-open-bg)',
        color: 'var(--nav-item-root-open-color)',
      }),
      ...(active && {
        backgroundColor: 'var(--nav-item-root-active-bg)',
        color: 'var(--nav-item-root-active-color)',
        '&:hover': {
          backgroundColor: 'var(--nav-item-root-active-hover-bg)',
        },
      }),
    }),
    
    // Sub item styles
    ...(depth > 0 && {
      ...(open && {
        backgroundColor: 'var(--nav-item-sub-open-bg)',
        color: 'var(--nav-item-sub-open-color)',
      }),
      ...(active && {
        backgroundColor: 'var(--nav-item-sub-active-bg)',
        color: 'var(--nav-item-sub-active-color)',
      }),
    }),
  };
});

const StyledSubheader = styled(Typography)(() => ({
  color: 'var(--nav-subheader-color)',
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  padding: '16px 16px 8px',
  lineHeight: 1.5,
}));

const NavIcon = styled(Box)(() => ({
  width: 'var(--nav-icon-size)',
  height: 'var(--nav-icon-size)',
  margin: 'var(--nav-icon-margin)',
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const NavInfo = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '12px',
  padding: '2px 8px',
  fontSize: '0.75rem',
  fontWeight: 600,
  minWidth: 20,
  textAlign: 'center',
  marginLeft: 'auto',
}));

interface NavItemProps {
  item: NavigationItem;
  depth: number;
  collapsed: boolean;
  currentPath?: string;
}

function NavItem({ item, depth, collapsed, currentPath }: NavItemProps) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = currentPath === item.path;

  const handleClick = useCallback(() => {
    if (hasChildren) {
      setOpen(!open);
    }
  }, [hasChildren, open]);

  // Collapsed mode - only show root level items as icons
  if (collapsed && depth === 0) {
    return (
      <StyledNavItem
        depth={depth}
        active={isActive}
        disabled={item.disabled}
        sx={{ justifyContent: 'center', px: 1, minHeight: '56px' }}
      >
        {item.icon && <NavIcon>{item.icon}</NavIcon>}
      </StyledNavItem>
    );
  }

  // Don't render children in collapsed mode
  if (collapsed && depth > 0) {
    return null;
  }

  return (
    <>
      <StyledNavItem
        depth={depth}
        active={isActive}
        hasChildren={hasChildren}
        open={open}
        disabled={item.disabled}
        onClick={handleClick}
      >
        {/* Only show icons on root level items */}
        {item.icon && depth === 0 && <NavIcon>{item.icon}</NavIcon>}
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'inherit',
              fontSize: 'inherit',
              color: 'inherit',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.title}
          </Typography>
        </Box>

        {item.info && <NavInfo>{item.info}</NavInfo>}
        
        {hasChildren && (
          <Box sx={{ ml: 1, color: 'inherit', opacity: 0.7 }}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </Box>
        )}
      </StyledNavItem>

      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 'var(--nav-item-gap)' }}>
            {item.children?.map((child) => (
              <NavItem
                key={child.id}
                item={child}
                depth={depth + 1}
                collapsed={collapsed}
                currentPath={currentPath}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </>
  );
}

export function NavigationDrawer({
  data,
  collapsed = false,
  width = 280,
  collapsedWidth = 64,
  header,
  footer,
  currentPath,
  theme: navTheme,
}: NavigationDrawerProps) {
  const drawerWidth = collapsed ? collapsedWidth : width;

  return (
    <StyledDrawer
      variant="permanent"
      navTheme={navTheme}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        {header && (
          <Box sx={collapsed ? { display: 'flex', justifyContent: 'center', py: 2.5 } : { pl: 3.5, pt: 2.5, pb: 1 }}>
            {header}
          </Box>
        )}

        {/* Navigation */}
        <Scrollbar fillContent autoHide={true}>
          <Box sx={{ px: 2, flex: '1 1 auto' }}>
            {data.map((section, sectionIndex) => (
              <Box key={sectionIndex}>
                {section.subheader && !collapsed && (
                  <StyledSubheader>{section.subheader}</StyledSubheader>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--nav-item-gap)' }}>
                  {section.items.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      depth={0}
                      collapsed={collapsed}
                      currentPath={currentPath}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Scrollbar>

        {/* Footer */}
        {footer && <Box>{footer}</Box>}
      </Box>
    </StyledDrawer>
  );
}
