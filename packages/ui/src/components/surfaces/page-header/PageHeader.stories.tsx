import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeader } from './page-header';

const meta: Meta<typeof PageHeader> = {
  title: 'Surfaces/Page Header',
  component: PageHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# PageHeader Component

A reusable page header component that provides a consistent layout for page titles, descriptions, breadcrumbs, and action buttons across your application.

## Features
- **Responsive Design**: Adapts to different screen sizes with proper spacing
- **Flexible Breadcrumbs**: Support for multi-level navigation breadcrumbs with customizable separator
- **Back Navigation**: Optional back arrow link for easy navigation
- **Configurable Actions**: Customizable action button with icon support
- **Custom Separator**: Customize breadcrumb separator (default: /)
- **Consistent Styling**: Matches Material-UI design system

## Usage
\`\`\`tsx
import { PageHeader } from '@asyml8/ui';

<PageHeader
  title="Page Title"
  description="Optional description text"
  breadcrumbs={[
    { label: 'Section' },
    { label: 'Current Page' }
  ]}
  action={{
    label: 'Action Button',
    onClick: handleClick,
    icon: <AddIcon />
  }}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      description: 'The main page title displayed prominently',
      control: 'text',
    },
    description: {
      description: 'Optional description text shown below the title',
      control: 'text',
    },
    breadcrumbs: {
      description: 'Array of breadcrumb items for navigation context. Each item can have label, href, and icon.',
      control: 'object',
    },
    backHref: {
      description: 'URL for back navigation. When provided, displays a back arrow before the title',
      control: 'text',
    },
    activeLast: {
      description: 'Whether the last breadcrumb link should be active/clickable (default: false)',
      control: 'boolean',
    },
    separator: {
      description: 'Character used to separate breadcrumb items (default: /)',
      control: 'text',
    },
    moreLinks: {
      description: 'Array of additional links displayed below the breadcrumbs',
      control: 'object',
    },
    action: {
      description: 'Configuration for the action button on the right side',
      control: 'object',
    },
    sx: {
      description: 'Custom MUI sx prop for styling',
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Basic: Story = {
  args: {
    title: 'Users',
    description: 'Manage user accounts, permissions, and access controls',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic page header with just title and description. Perfect for simple pages that don\'t require navigation context or actions.',
      },
    },
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    title: 'Users',
    description: 'Manage user accounts, permissions, and access controls',
    breadcrumbs: [
      { label: 'Administration' },
      { label: 'Users' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Page header with breadcrumb navigation. Breadcrumbs are displayed below the title and help users understand their current location in the application hierarchy.',
      },
    },
  },
};

export const WithAction: Story = {
  args: {
    title: 'Users',
    description: 'Manage user accounts, permissions, and access controls',
    breadcrumbs: [
      { label: 'Administration' },
      { label: 'Users' },
    ],
    action: {
      label: 'Add User',
      onClick: () => console.log('Add user clicked'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      ),
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete page header with title, description, breadcrumbs, and a primary action button. This is the most common configuration for admin pages.',
      },
    },
  },
};

export const WithOutlinedAction: Story = {
  args: {
    title: 'Settings',
    description: 'Configure application settings and preferences',
    breadcrumbs: [
      { label: 'Administration' },
      { label: 'Settings' },
    ],
    action: {
      label: 'Save Changes',
      onClick: () => console.log('Save clicked'),
      variant: 'outlined',
      color: 'primary',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Page header with an outlined action button. Use outlined buttons for secondary actions or when you want a less prominent call-to-action.',
      },
    },
  },
};

export const MinimalHeader: Story = {
  args: {
    title: 'Dashboard',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal page header with only a title. Suitable for landing pages or when you want to keep the interface clean and focused.',
      },
    },
  },
};

export const LongContent: Story = {
  args: {
    title: 'User Management System Administration Panel',
    description: 'Comprehensive user management interface for administrators to manage user accounts, permissions, roles, access controls, and security settings across the entire application platform.',
    breadcrumbs: [
      { label: 'Administration' },
      { label: 'User Management' },
      { label: 'Advanced Settings' },
    ],
    action: {
      label: 'Create New User Account',
      onClick: () => console.log('Create user clicked'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      ),
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with longer content to demonstrate how the component handles text wrapping and maintains proper spacing with extended titles and descriptions.',
      },
    },
  },
};

export const WithBackNavigation: Story = {
  args: {
    title: 'Submission Details',
    description: 'View and edit submission information',
    backHref: '/my-workspace/submissions',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Submissions', href: '/my-workspace/submissions' },
      { label: 'Details' },
    ],
    action: {
      label: 'Edit',
      onClick: () => console.log('Edit clicked'),
      variant: 'contained',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Page header with back navigation. The title becomes a clickable link with a back arrow, perfect for detail pages where users need to quickly return to the list view.',
      },
    },
  },
};

export const WithCustomSeparator: Story = {
  args: {
    title: 'Users',
    description: 'Manage user accounts and permissions',
    breadcrumbs: [
      { label: 'Administration', href: '/admin' },
      { label: 'Users' },
    ],
    separator: '>',
    action: {
      label: 'Add User',
      onClick: () => console.log('Add user clicked'),
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Page header with a custom breadcrumb separator. You can use any character like >, ›, •, or → to customize the look of your breadcrumbs.',
      },
    },
  },
};

export const WithBreadcrumbIcons: Story = {
  args: {
    title: 'Dashboard',
    description: 'System overview and analytics',
    breadcrumbs: [
      {
        label: 'Home',
        href: '/',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        ),
      },
      { label: 'Dashboard' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Page header with icons in breadcrumbs. Add visual context to your navigation by including icons with breadcrumb items.',
      },
    },
  },
};

export const WithMoreLinks: Story = {
  args: {
    title: 'API Documentation',
    description: 'REST API endpoints and usage examples',
    breadcrumbs: [
      { label: 'Resources', href: '/resources' },
      { label: 'Documentation' },
    ],
    moreLinks: ['Getting Started', 'Authentication', 'Rate Limits', 'Webhooks'],
    action: {
      label: 'View API Keys',
      onClick: () => console.log('View keys clicked'),
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Page header with additional links displayed below the breadcrumbs. Perfect for documentation pages or sections with multiple related pages.',
      },
    },
  },
};
