import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import {
  Dashboard,
  People,
  Settings,
  Folder,
  Assignment,
  ContactMail,
  Help,
  GetApp,
  ShoppingBag,
  BarChart,
  AccountBalance,
  MenuBook,
  Description,
  School,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { NavigationDrawer } from './navigation-drawer';
import type { NavigationSection, NavigationTheme } from './navigation-drawer';

const meta: Meta<typeof NavigationDrawer> = {
  title: 'Surfaces/Navigation Drawer (Archived)',
  component: NavigationDrawer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# NavigationDrawer

A fully customizable, data-driven navigation drawer component that provides a tree-like hierarchical menu structure with support for nested items, themes, and responsive behavior.

## Features

- 🌳 **Tree Structure**: Supports nested navigation items with visual hierarchy
- 🎨 **Theme Support**: Auto-detects light/dark themes and provides custom theme options
- 📱 **Responsive**: Collapsible mini-mode for smaller screens
- 🎯 **Active States**: Automatic active state detection based on current path
- 🔄 **Smooth Animations**: Expand/collapse animations for nested items
- 📊 **Info Badges**: Support for badges and counters on menu items
- ♿ **Accessible**: Built with MUI components for accessibility compliance

## Data Structure

The component uses a simple, intuitive data structure:

\`\`\`typescript
interface NavigationItem {
  id: string;
  title: string;
  path?: string;
  icon?: React.ReactNode;
  info?: string;
  disabled?: boolean;
  children?: NavigationItem[];
}

interface NavigationSection {
  subheader?: string;
  items: NavigationItem[];
}
\`\`\`

## Theme Customization

Customize colors and appearance with the theme prop:

\`\`\`typescript
interface NavigationTheme {
  backgroundColor?: string;
  textColor?: string;
  activeColor?: string;
  hoverColor?: string;
  subheaderColor?: string;
}
\`\`\`

## Usage Examples

### Basic Usage
\`\`\`tsx
const navigationData = [
  {
    subheader: 'MAIN',
    items: [
      { id: 'dashboard', title: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { id: 'users', title: 'Users', icon: <UsersIcon />, path: '/users' },
    ]
  }
];

<NavigationDrawer 
  data={navigationData}
  currentPath="/dashboard"
  header={<Logo />}
/>
\`\`\`

### With Nested Items
\`\`\`tsx
const navigationData = [
  {
    subheader: 'MANAGEMENT',
    items: [
      {
        id: 'user',
        title: 'User Management',
        icon: <UsersIcon />,
        children: [
          { id: 'profile', title: 'Profile', path: '/user/profile' },
          { id: 'settings', title: 'Settings', path: '/user/settings' },
        ]
      }
    ]
  }
];
\`\`\`

### Custom Theme
\`\`\`tsx
const customTheme = {
  backgroundColor: '#1a1a1a',
  textColor: '#ffffff',
  activeColor: '#00bcd4',
  hoverColor: 'rgba(255, 255, 255, 0.1)'
};

<NavigationDrawer 
  data={navigationData}
  theme={customTheme}
/>
\`\`\`

### Collapsible
\`\`\`tsx
const [collapsed, setCollapsed] = useState(false);

<NavigationDrawer 
  data={navigationData}
  collapsed={collapsed}
  onToggleCollapse={() => setCollapsed(!collapsed)}
/>
\`\`\`
        `,
      },
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h4">Main Content Area</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            This is where your main application content would go.
          </Typography>
        </Box>
      </Box>
    ),
  ],
  argTypes: {
    collapsed: {
      control: 'boolean',
      description: 'Whether the drawer is in collapsed (mini) mode',
    },
    width: {
      control: { type: 'number', min: 200, max: 400, step: 10 },
      description: 'Width of the drawer when expanded',
    },
    collapsedWidth: {
      control: { type: 'number', min: 50, max: 100, step: 5 },
      description: 'Width of the drawer when collapsed',
    },
    currentPath: {
      control: 'text',
      description: 'Current active path for highlighting active menu items',
    },
    theme: {
      control: 'object',
      description: 'Custom theme configuration for colors and styling',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NavigationDrawer>;

const mockNavigationData: NavigationSection[] = [
  {
    subheader: 'OVERVIEW',
    items: [
      {
        id: 'app',
        title: 'App',
        icon: <Dashboard />,
        path: '/app',
      },
      {
        id: 'ecommerce',
        title: 'Ecommerce',
        icon: <ShoppingBag />,
        path: '/ecommerce',
      },
      {
        id: 'analytics',
        title: 'Analytics',
        icon: <BarChart />,
        path: '/analytics',
      },
      {
        id: 'banking',
        title: 'Banking',
        icon: <AccountBalance />,
        path: '/banking',
      },
      {
        id: 'booking',
        title: 'Booking',
        icon: <MenuBook />,
        path: '/booking',
      },
      {
        id: 'file',
        title: 'File',
        icon: <Description />,
        path: '/file',
      },
      {
        id: 'course',
        title: 'Course',
        icon: <School />,
        path: '/course',
      },
      {
        id: 'docs',
        title: 'Docs',
        icon: <Description />,
        path: '/docs',
      },
    ],
  },
  {
    subheader: 'MANAGEMENT',
    items: [
      {
        id: 'user',
        title: 'User',
        icon: <People />,
        info: '5',
        children: [
          { id: 'profile', title: 'Profile', path: '/user/profile' },
          { id: 'cards', title: 'Cards', path: '/user/cards' },
          { id: 'list', title: 'List', path: '/user/list' },
          { id: 'create', title: 'Create', path: '/user/create' },
          { id: 'edit', title: 'Edit', path: '/user/edit' },
          { id: 'account', title: 'Account', path: '/user/account' },
        ],
      },
      {
        id: 'product',
        title: 'Product',
        icon: <Assignment />,
        path: '/product',
      },
      {
        id: 'order',
        title: 'Order',
        icon: <ContactMail />,
        path: '/order',
      },
      {
        id: 'invoice',
        title: 'Invoice',
        icon: <Description />,
        path: '/invoice',
      },
      {
        id: 'blog',
        title: 'Blog',
        icon: <Help />,
        path: '/blog',
      },
      {
        id: 'job',
        title: 'Job',
        icon: <GetApp />,
        path: '/job',
      },
    ],
  },
];

const Logo = () => (
  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>P</Avatar>
);

/**
 * Default NavigationDrawer with all features demonstrated
 */
export const Default: Story = {
  args: {
    data: mockNavigationData,
    currentPath: '/user/profile',
    header: <Logo />,
    width: 280,
    collapsedWidth: 64,
  },
};

/**
 * Interactive collapse/expand functionality with toggle button
 */
export const WithCollapse: Story = {
  render: (args) => {
    const [collapsed, setCollapsed] = useState(false);
    
    return (
      <NavigationDrawer
        {...args}
        collapsed={collapsed}
        header={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {!collapsed && <Logo />}
            {collapsed && <Logo />}
            <IconButton 
              onClick={() => setCollapsed(!collapsed)}
              sx={{ color: 'inherit', ml: collapsed ? 0 : 'auto' }}
              size="small"
            >
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </Box>
        }
      />
    );
  },
  args: {
    data: mockNavigationData,
    currentPath: '/analytics',
  },
  parameters: {
    docs: {
      description: {
        story: 'NavigationDrawer with interactive collapse/expand functionality. Click the chevron button to toggle between full and mini modes.',
      },
    },
  },
};

/**
 * Collapsed (mini) mode showing only icons
 */
export const Collapsed: Story = {
  args: {
    data: mockNavigationData,
    currentPath: '/user/cards',
    collapsed: true,
    header: <Logo />,
  },
  parameters: {
    docs: {
      description: {
        story: 'NavigationDrawer in collapsed mode shows only icons with tooltips on hover. Nested items are hidden in this mode.',
      },
    },
  },
};

/**
 * Demonstrates info badges and counters on menu items
 */
export const WithBadges: Story = {
  args: {
    data: [
      {
        subheader: 'OVERVIEW',
        items: [
          {
            id: 'dashboard',
            title: 'Dashboard',
            icon: <Dashboard />,
            path: '/dashboard',
            info: 'New',
          },
          {
            id: 'analytics',
            title: 'Analytics',
            icon: <BarChart />,
            path: '/analytics',
            info: '12',
          },
        ],
      },
      {
        subheader: 'MANAGEMENT',
        items: [
          {
            id: 'users',
            title: 'Users',
            icon: <People />,
            info: '99+',
            children: [
              { id: 'list', title: 'List', path: '/users/list', info: '5' },
              { id: 'create', title: 'Create', path: '/users/create' },
            ],
          },
        ],
      },
    ],
    currentPath: '/dashboard',
    header: <Logo />,
  },
  parameters: {
    docs: {
      description: {
        story: 'NavigationDrawer supports info badges and counters on both parent and child menu items.',
      },
    },
  },
};

/**
 * Custom theme example with different colors
 */
export const CustomTheme: Story = {
  args: {
    data: mockNavigationData,
    currentPath: '/ecommerce',
    header: <Logo />,
    theme: {
      backgroundColor: '#1a237e',
      textColor: '#ffffff',
      activeColor: '#00bcd4',
      hoverColor: 'rgba(255, 255, 255, 0.1)',
      subheaderColor: '#9fa8da',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'NavigationDrawer with custom theme colors. You can customize background, text, active, hover, and subheader colors.',
      },
    },
  },
};

/**
 * Light theme optimized version
 */
export const LightTheme: Story = {
  args: {
    data: mockNavigationData,
    currentPath: '/banking',
    header: <Logo />,
    theme: {
      backgroundColor: '#fafafa',
      textColor: '#333333',
      activeColor: '#1976d2',
      hoverColor: 'rgba(0, 0, 0, 0.04)',
      subheaderColor: '#666666',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'NavigationDrawer optimized for light themes with appropriate contrast ratios.',
      },
    },
  },
};

/**
 * Minimal example with just basic navigation
 */
export const Minimal: Story = {
  args: {
    data: [
      {
        items: [
          { id: 'home', title: 'Home', icon: <Dashboard />, path: '/' },
          { id: 'about', title: 'About', icon: <Help />, path: '/about' },
          { id: 'contact', title: 'Contact', icon: <ContactMail />, path: '/contact' },
        ],
      },
    ],
    currentPath: '/',
    width: 240,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal NavigationDrawer without subheaders, badges, or nested items.',
      },
    },
  },
};
