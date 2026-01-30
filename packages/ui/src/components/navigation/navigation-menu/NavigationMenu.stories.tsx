'use client';

// @ts-nocheck - Storybook types are dev-only
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavSectionVertical } from './vertical';
import { NavSectionHorizontal } from './horizontal';
import { NavSectionMini } from './mini';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';

const meta: Meta<typeof NavSectionVertical> = {
  title: 'Navigation/Navigation Menu',
  component: NavSectionVertical,
  parameters: {
    layout: 'padded',
    // Prevent Next.js router from actually navigating in Storybook
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/dashboard/user/profile',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof NavSectionVertical>;

// Wrapper component that prevents default link navigation and simulates active states
const StorybookWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Prevent all link clicks from navigating and simulate active state
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button, a');
      if (button) {
        e.preventDefault();

        // Remove active class from all nav items
        document.querySelectorAll('.nav__item__root').forEach(item => {
          item.classList.remove('--active');
        });

        // Add active class to clicked item
        const navItem = button.classList.contains('nav__item__root')
          ? button
          : button.closest('.nav__item__root');
        if (navItem) {
          navItem.classList.add('--active');
        }

        console.log('Would navigate to:', button.getAttribute('href'));
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return <>{children}</>;
};

// ----------------------------------------------------------------------

const dashboardNavData = [
  {
    subheader: 'OVERVIEW',
    items: [
      {
        title: 'App',
        path: '/dashboard/app',
        icon: 'solar:widget-4-bold-duotone',
      },
      {
        title: 'Ecommerce',
        path: '/dashboard/ecommerce',
        icon: 'solar:cart-large-2-bold-duotone',
      },
      {
        title: 'Analytics',
        path: '/dashboard/analytics',
        icon: 'solar:chart-bold-duotone',
      },
      {
        title: 'Banking',
        path: '/dashboard/banking',
        icon: 'solar:hand-money-bold-duotone',
      },
      {
        title: 'Booking',
        path: '/dashboard/booking',
        icon: 'solar:calendar-bold-duotone',
      },
      {
        title: 'File',
        path: '/dashboard/file',
        icon: 'solar:folder-bold-duotone',
      },
    ],
  },
  {
    subheader: 'MANAGEMENT',
    items: [
      {
        title: 'User',
        path: '/dashboard/user',
        icon: 'solar:users-group-rounded-bold-duotone',
        children: [
          {
            title: 'Profile',
            path: '/dashboard/user/profile',
          },
          {
            title: 'Cards',
            path: '/dashboard/user/cards',
          },
          {
            title: 'List',
            path: '/dashboard/user/list',
          },
          {
            title: 'Create',
            path: '/dashboard/user/create',
          },
          {
            title: 'Edit',
            path: '/dashboard/user/edit',
          },
          {
            title: 'Account',
            path: '/dashboard/user/account',
          },
        ],
      },
      {
        title: 'Product',
        path: '/dashboard/product',
        icon: 'solar:box-bold-duotone',
        children: [
          {
            title: 'List',
            path: '/dashboard/product/list',
          },
          {
            title: 'Details',
            path: '/dashboard/product/details',
          },
          {
            title: 'Create',
            path: '/dashboard/product/create',
          },
          {
            title: 'Edit',
            path: '/dashboard/product/edit',
          },
        ],
      },
      {
        title: 'Order',
        path: '/dashboard/order',
        icon: 'solar:bill-list-bold-duotone',
        info: ['12'],
        children: [
          {
            title: 'List',
            path: '/dashboard/order/list',
          },
          {
            title: 'Details',
            path: '/dashboard/order/details',
          },
        ],
      },
      {
        title: 'Invoice',
        path: '/dashboard/invoice',
        icon: 'solar:document-text-bold-duotone',
        children: [
          {
            title: 'List',
            path: '/dashboard/invoice/list',
          },
          {
            title: 'Details',
            path: '/dashboard/invoice/details',
          },
          {
            title: 'Create',
            path: '/dashboard/invoice/create',
          },
          {
            title: 'Edit',
            path: '/dashboard/invoice/edit',
          },
        ],
      },
      {
        title: 'Blog',
        path: '/dashboard/blog',
        icon: 'solar:notebook-bold-duotone',
        children: [
          {
            title: 'List',
            path: '/dashboard/blog/list',
          },
          {
            title: 'Details',
            path: '/dashboard/blog/details',
          },
          {
            title: 'Create',
            path: '/dashboard/blog/create',
          },
          {
            title: 'Edit',
            path: '/dashboard/blog/edit',
          },
        ],
      },
      {
        title: 'Job',
        path: '/dashboard/job',
        icon: 'solar:case-round-bold-duotone',
        children: [
          {
            title: 'List',
            path: '/dashboard/job/list',
          },
          {
            title: 'Details',
            path: '/dashboard/job/details',
          },
          {
            title: 'Create',
            path: '/dashboard/job/create',
          },
          {
            title: 'Edit',
            path: '/dashboard/job/edit',
          },
        ],
      },
      {
        title: 'Tour',
        path: '/dashboard/tour',
        icon: 'solar:suitcase-lines-bold-duotone',
        children: [
          {
            title: 'List',
            path: '/dashboard/tour/list',
          },
          {
            title: 'Details',
            path: '/dashboard/tour/details',
          },
          {
            title: 'Create',
            path: '/dashboard/tour/create',
          },
          {
            title: 'Edit',
            path: '/dashboard/tour/edit',
          },
        ],
      },
    ],
  },
];

export const DashboardSidebar: Story = {
  args: {
    data: dashboardNavData,
  },
  render: (args) => (
    <StorybookWrapper>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Paper
          elevation={3}
          sx={{
            width: 280,
            height: '100%',
            overflow: 'auto',
            borderRadius: 0,
          }}
        >
          <NavSectionVertical {...args} />
        </Paper>
      </Box>
    </StorybookWrapper>
  ),
};

// ----------------------------------------------------------------------

const simpleNavData = [
  {
    items: [
      {
        title: 'Dashboard',
        path: '/',
        icon: 'solar:widget-4-bold-duotone',
      },
      {
        title: 'Users',
        path: '/users',
        icon: 'solar:users-group-rounded-bold-duotone',
      },
      {
        title: 'Settings',
        path: '/settings',
        icon: 'solar:settings-bold-duotone',
      },
    ],
  },
];

export const SimpleNavigation: Story = {
  args: {
    data: simpleNavData,
  },
  render: (args: any) => (
    <StorybookWrapper>
      <Box sx={{ display: 'flex' }}>
        <Paper
          elevation={3}
          sx={{
            width: 280,
            height: 400,
            overflow: 'auto',
            borderRadius: 2,
          }}
        >
          <NavSectionVertical {...args} />
        </Paper>
      </Box>
    </StorybookWrapper>
  ),
};

// ----------------------------------------------------------------------

const nestedNavData = [
  {
    subheader: 'MENU',
    items: [
      {
        title: 'Level 1',
        path: '/level-1',
        icon: 'solar:folder-bold-duotone',
        children: [
          {
            title: 'Level 2.1',
            path: '/level-1/level-2-1',
            children: [
              {
                title: 'Level 3.1',
                path: '/level-1/level-2-1/level-3-1',
              },
              {
                title: 'Level 3.2',
                path: '/level-1/level-2-1/level-3-2',
              },
            ],
          },
          {
            title: 'Level 2.2',
            path: '/level-1/level-2-2',
            children: [
              {
                title: 'Level 3.3',
                path: '/level-1/level-2-2/level-3-3',
              },
            ],
          },
        ],
      },
      {
        title: 'Another Item',
        path: '/another',
        icon: 'solar:document-bold-duotone',
      },
    ],
  },
];

export const NestedNavigation: Story = {
  args: {
    data: nestedNavData,
  },
  render: (args: any) => (
    <StorybookWrapper>
      <Box sx={{ display: 'flex' }}>
        <Paper
          elevation={3}
          sx={{
            width: 280,
            height: 400,
            overflow: 'auto',
            borderRadius: 2,
          }}
        >
          <NavSectionVertical {...args} />
        </Paper>
      </Box>
    </StorybookWrapper>
  ),
};

// ----------------------------------------------------------------------

const navWithInfoData = [
  {
    subheader: 'NOTIFICATIONS',
    items: [
      {
        title: 'Messages',
        path: '/messages',
        icon: 'solar:chat-round-bold-duotone',
        info: ['5'],
      },
      {
        title: 'Orders',
        path: '/orders',
        icon: 'solar:cart-large-2-bold-duotone',
        info: ['12'],
      },
      {
        title: 'Tasks',
        path: '/tasks',
        icon: 'solar:checklist-bold-duotone',
        info: ['3'],
      },
    ],
  },
];

export const NavigationWithBadges: Story = {
  args: {
    data: navWithInfoData,
  },
  render: (args: any) => (
    <StorybookWrapper>
      <Box sx={{ display: 'flex' }}>
        <Paper
          elevation={3}
          sx={{
            width: 280,
            height: 300,
            overflow: 'auto',
            borderRadius: 2,
          }}
        >
          <NavSectionVertical {...args} />
        </Paper>
      </Box>
    </StorybookWrapper>
  ),
};

// ----------------------------------------------------------------------

const navWithCaptionsData = [
  {
    items: [
      {
        title: 'Dashboard',
        path: '/',
        icon: 'solar:widget-4-bold-duotone',
        caption: 'Main overview page',
      },
      {
        title: 'Analytics',
        path: '/analytics',
        icon: 'solar:chart-bold-duotone',
        caption: 'View detailed reports',
      },
      {
        title: 'Settings',
        path: '/settings',
        icon: 'solar:settings-bold-duotone',
        caption: 'Configure your app',
      },
    ],
  },
];

export const NavigationWithCaptions: Story = {
  args: {
    data: navWithCaptionsData,
  },
  render: (args: any) => (
    <StorybookWrapper>
      <Box sx={{ display: 'flex' }}>
        <Paper
          elevation={3}
          sx={{
            width: 280,
            height: 300,
            overflow: 'auto',
            borderRadius: 2,
          }}
        >
          <NavSectionVertical {...args} />
        </Paper>
      </Box>
    </StorybookWrapper>
  ),
};

// ----------------------------------------------------------------------

const multipleGroupsData = [
  {
    subheader: 'GENERAL',
    items: [
      {
        title: 'Dashboard',
        path: '/',
        icon: 'solar:widget-4-bold-duotone',
      },
      {
        title: 'Calendar',
        path: '/calendar',
        icon: 'solar:calendar-bold-duotone',
      },
    ],
  },
  {
    subheader: 'CONTENT',
    items: [
      {
        title: 'Blog',
        path: '/blog',
        icon: 'solar:notebook-bold-duotone',
      },
      {
        title: 'Media',
        path: '/media',
        icon: 'solar:gallery-bold-duotone',
      },
    ],
  },
  {
    subheader: 'SETTINGS',
    items: [
      {
        title: 'Profile',
        path: '/profile',
        icon: 'solar:user-bold-duotone',
      },
      {
        title: 'System',
        path: '/system',
        icon: 'solar:settings-bold-duotone',
      },
    ],
  },
];

export const MultipleGroups: Story = {
  args: {
    data: multipleGroupsData,
  },
  render: (args: any) => (
    <StorybookWrapper>
      <Box sx={{ display: 'flex' }}>
        <Paper
          elevation={3}
          sx={{
            width: 280,
            height: 500,
            overflow: 'auto',
            borderRadius: 2,
          }}
        >
          <NavSectionVertical {...args} />
        </Paper>
      </Box>
    </StorybookWrapper>
  ),
};

// ----------------------------------------------------------------------

const navWithLabelsData = [
  {
    subheader: 'FEATURES',
    items: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: 'solar:widget-4-bold-duotone',
        label: { content: 'NEW', color: 'success', variant: 'soft', startIcon: '✓' },
      },
      {
        title: 'Analytics',
        path: '/analytics',
        icon: 'solar:chart-bold-duotone',
        label: { content: 'BETA', color: 'info', variant: 'soft' },
      },
      {
        title: 'Reports',
        path: '/reports',
        icon: 'solar:document-text-bold-duotone',
      },
      {
        title: 'Settings',
        path: '/settings',
        icon: 'solar:settings-bold-duotone',
        label: { content: 'COMING SOON', color: 'warning', variant: 'outlined' },
      },
    ],
  },
  {
    subheader: 'MANAGEMENT',
    items: [
      {
        title: 'Users',
        path: '/users',
        icon: 'solar:users-group-rounded-bold-duotone',
        label: { content: 'v2', color: 'secondary', variant: 'filled' },
        children: [
          {
            title: 'List',
            path: '/users/list',
          },
          {
            title: 'Create',
            path: '/users/create',
            label: { content: 'NEW', color: 'success', variant: 'soft' },
          },
        ],
      },
      {
        title: 'Products',
        path: '/products',
        icon: 'solar:box-bold-duotone',
        label: { content: 'PRO', color: 'error', variant: 'soft' },
        children: [
          {
            title: 'List',
            path: '/products/list',
          },
          {
            title: 'Create',
            path: '/products/create',
            label: { content: 'NEW', color: 'primary', variant: 'filled', startIcon: '🎉' },
          },
        ],
      },
    ],
  },
];

export const NavigationWithLabels: Story = {
  args: {
    data: navWithLabelsData,
  },
  render: (args: any) => (
    <StorybookWrapper>
      <Box sx={{ display: 'flex' }}>
        <Paper
          elevation={3}
          sx={{
            width: 280,
            height: 500,
            overflow: 'auto',
            borderRadius: 2,
          }}
        >
          <NavSectionVertical {...args} />
        </Paper>
      </Box>
    </StorybookWrapper>
  ),
};

// ----------------------------------------------------------------------

export const WithoutPrimaryColor: Story = {
  args: {
    data: dashboardNavData,
    usePrimaryColor: false,
  },
  render: (args: any) => (
    <StorybookWrapper>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box>
          <Box sx={{ mb: 1, typography: 'caption', color: 'text.secondary' }}>
            With Primary Color (default)
          </Box>
          <Paper
            elevation={3}
            sx={{
              width: 280,
              height: 400,
              overflow: 'auto',
              borderRadius: 2,
            }}
          >
            <NavSectionVertical data={dashboardNavData} usePrimaryColor={true} />
          </Paper>
        </Box>
        <Box>
          <Box sx={{ mb: 1, typography: 'caption', color: 'text.secondary' }}>
            Without Primary Color
          </Box>
          <Paper
            elevation={3}
            sx={{
              width: 280,
              height: 400,
              overflow: 'auto',
              borderRadius: 2,
            }}
          >
            <NavSectionVertical {...args} />
          </Paper>
        </Box>
      </Box>
    </StorybookWrapper>
  ),
};

// ----------------------------------------------------------------------

export const HorizontalNavigation: Story = {
  args: {
    data: dashboardNavData,
  },
  render: (args: any) => (
    <StorybookWrapper>
      <Box sx={{ display: 'flex' }}>
        <NavSectionHorizontal {...args} />
      </Box>
    </StorybookWrapper>
  ),
};

// ----------------------------------------------------------------------

export const HorizontalWithLabels: Story = {
  args: {
    data: navWithLabelsData,
  },
  render: (args: any) => (
    <StorybookWrapper>
      <Box sx={{ display: 'flex' }}>
        <NavSectionHorizontal {...args} />
      </Box>
    </StorybookWrapper>
  ),
};

// ----------------------------------------------------------------------

export const MiniNavigation: Story = {
  args: {
    data: dashboardNavData,
  },
  render: (args: any) => (
    <StorybookWrapper>
      <Box sx={{ display: 'flex' }}>
        <Paper
          elevation={3}
          sx={{
            width: 80,
            height: 600,
            overflow: 'auto',
            borderRadius: 2,
          }}
        >
          <NavSectionMini {...args} />
        </Paper>
      </Box>
    </StorybookWrapper>
  ),
};

// ----------------------------------------------------------------------

export const MiniWithLabels: Story = {
  args: {
    data: navWithLabelsData,
  },
  render: (args: any) => (
    <StorybookWrapper>
      <Box sx={{ display: 'flex' }}>
        <Paper
          elevation={3}
          sx={{
            width: 80,
            height: 600,
            overflow: 'auto',
            borderRadius: 2,
          }}
        >
          <NavSectionMini {...args} />
        </Paper>
      </Box>
    </StorybookWrapper>
  ),
};

// ----------------------------------------------------------------------

export const MiniIconsOnly: Story = {
  args: {
    data: dashboardNavData,
    hideLabels: true,
  },
  render: (args: any) => (
    <StorybookWrapper>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Paper
          elevation={3}
          sx={{
            width: 64,
            height: 600,
            overflow: 'auto',
            borderRadius: 2,
          }}
        >
          <NavSectionMini {...args} />
        </Paper>
        <Box sx={{ flex: 1, p: 3 }}>
          <Box sx={{ mb: 2, typography: 'h6' }}>Icons Only Mode</Box>
          <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
            Set <code>hideLabels=true</code> to display only icons in mini navigation, creating an ultra-compact sidebar.
          </Box>
        </Box>
      </Box>
    </StorybookWrapper>
  ),
};
