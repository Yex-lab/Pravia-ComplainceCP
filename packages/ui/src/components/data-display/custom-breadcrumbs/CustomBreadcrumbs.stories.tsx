import type { Meta, StoryObj } from '@storybook/react-vite';
import { CustomBreadcrumbs } from './custom-breadcrumbs';

const meta: Meta<typeof CustomBreadcrumbs> = {
  title: 'Data Display/Custom Breadcrumbs',
  component: CustomBreadcrumbs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# CustomBreadcrumbs Component

A flexible and feature-rich breadcrumbs component built on Material-UI with support for navigation links, headings, back links, and custom separators.

## Features
- **Material-UI Integration**: Uses MUI Breadcrumbs component with styled separators
- **Flexible Navigation**: Support for multi-level breadcrumb links with icons
- **Back Navigation**: Optional back arrow link with heading
- **Sub Headers**: Support for heading, subHeading, and subHeader text
- **Custom Separator**: Customize breadcrumb separator character (default: /)
- **More Links**: Display additional related links below breadcrumbs
- **Action Support**: Optional action elements displayed on the right
- **Slot Customization**: Advanced customization via slots and slotProps

## Usage
\`\`\`tsx
import { CustomBreadcrumbs } from '@asyml8/ui';

<CustomBreadcrumbs
  heading="Page Title"
  subHeader="Optional description"
  links={[
    { name: 'Home', href: '/' },
    { name: 'Current Page' }
  ]}
  separator="/"
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    heading: {
      description: 'Main heading text displayed prominently',
      control: 'text',
    },
    subHeading: {
      description: 'Secondary heading text',
      control: 'text',
    },
    subHeader: {
      description: 'Description text displayed below the heading',
      control: 'text',
    },
    links: {
      description: 'Array of breadcrumb link items. Each item can have name, href, icon, and disabled properties.',
      control: 'object',
    },
    backHref: {
      description: 'URL for back navigation. When provided, replaces heading with a back arrow link.',
      control: 'text',
    },
    activeLast: {
      description: 'Whether the last breadcrumb link should be active/clickable (default: false)',
      control: 'boolean',
    },
    separator: {
      description: 'Character or string used to separate breadcrumb items (default: /)',
      control: 'text',
    },
    moreLinks: {
      description: 'Array of additional link strings displayed below the breadcrumbs',
      control: 'object',
    },
    action: {
      description: 'React node for action elements displayed on the right',
      control: 'object',
    },
    sx: {
      description: 'Custom MUI sx prop for styling',
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CustomBreadcrumbs>;

export const Basic: Story = {
  args: {
    heading: 'Dashboard',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Dashboard' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic breadcrumbs with heading and navigation links. The last link is disabled by default.',
      },
    },
  },
};

export const WithSubHeader: Story = {
  args: {
    heading: 'User Management',
    subHeader: 'Manage user accounts, permissions, and access controls',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Administration', href: '/admin' },
      { name: 'Users' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumbs with a subHeader that provides additional context below the main heading.',
      },
    },
  },
};

export const WithBackLink: Story = {
  args: {
    heading: 'Submission Details',
    subHeader: 'View and edit submission information',
    backHref: '/my-workspace/submissions',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Submissions', href: '/my-workspace/submissions' },
      { name: 'Details' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumbs with back navigation. The heading is replaced with a clickable back arrow link.',
      },
    },
  },
};

export const WithIcons: Story = {
  args: {
    heading: 'Dashboard',
    links: [
      {
        name: 'Home',
        href: '/',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        ),
      },
      {
        name: 'Analytics',
        href: '/analytics',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
        ),
      },
      { name: 'Dashboard' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumbs with icons for visual context. Icons are displayed before the link text.',
      },
    },
  },
};

export const CustomSeparator: Story = {
  args: {
    heading: 'Settings',
    subHeader: 'Configure application preferences',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Administration', href: '/admin' },
      { name: 'Settings' },
    ],
    separator: '>',
  },
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumbs with a custom separator character. You can use any character like >, ›, •, or →.',
      },
    },
  },
};

export const WithMoreLinks: Story = {
  args: {
    heading: 'API Documentation',
    subHeader: 'REST API reference and guides',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Resources', href: '/resources' },
      { name: 'Documentation' },
    ],
    moreLinks: ['Getting Started', 'Authentication', 'Rate Limits', 'Webhooks', 'SDKs'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumbs with additional related links displayed below. Perfect for documentation sections.',
      },
    },
  },
};

export const ActiveLastLink: Story = {
  args: {
    heading: 'Products',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Catalog', href: '/catalog' },
      { name: 'Products', href: '/catalog/products' },
    ],
    activeLast: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumbs with the last link enabled. By default, the last link is disabled to indicate current location.',
      },
    },
  },
};

export const WithSubHeading: Story = {
  args: {
    heading: 'User Profile',
    subHeading: 'john.doe@example.com',
    subHeader: 'Manage your profile settings and preferences',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Account', href: '/account' },
      { name: 'Profile' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumbs with both subHeading (secondary identifier) and subHeader (description text).',
      },
    },
  },
};

export const MinimalBreadcrumbs: Story = {
  args: {
    links: [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/about' },
      { name: 'Team' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal breadcrumbs without heading or description. Just the navigation path.',
      },
    },
  },
};

export const ComplexExample: Story = {
  args: {
    heading: 'Project Management',
    subHeader: 'Manage projects, tasks, and team collaboration',
    links: [
      {
        name: 'Home',
        href: '/',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        ),
      },
      { name: 'Workspace', href: '/workspace' },
      { name: 'Projects', href: '/workspace/projects' },
      { name: 'Details' },
    ],
    separator: '›',
    moreLinks: ['Team Members', 'Activity Log', 'Settings'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Complex example showcasing all features: heading, subHeader, icons, custom separator, and more links.',
      },
    },
  },
};
