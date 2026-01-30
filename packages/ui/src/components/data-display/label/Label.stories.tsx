import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './label';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const meta: Meta<typeof Label> = {
  title: 'Data Display/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Label

A versatile badge/chip component for displaying status, categories, or any short text with visual emphasis.

## Features

- 🎨 **Multiple variants** - filled, soft, outlined, inverted
- 🌈 **Color options** - primary, secondary, info, success, warning, error, white, black, default
- 🔧 **Icon support** - start and end icons
- ♿ **Accessible** - proper contrast and keyboard navigation
- 🎯 **Auto-capitalize** - automatically capitalizes text
- 🌙 **Theme aware** - adapts to light/dark themes

## Usage

\`\`\`tsx
import { Label } from '@asyml8/ui';

// Basic usage
<Label>New</Label>

// With color and variant
<Label color="success" variant="filled">Active</Label>

// With icons
<Label 
  color="primary" 
  startIcon={<StarIcon />}
  endIcon={<ArrowIcon />}
>
  Featured
</Label>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error', 'white', 'black'],
      description: 'Color variant of the label',
    },
    variant: {
      control: 'select',
      options: ['filled', 'soft', 'outlined', 'inverted'],
      description: 'Visual style variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the label is disabled',
    },
    children: {
      control: 'text',
      description: 'Label content',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Label',
  },
};

export const Colors: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom>Filled Variant</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Label color="default" variant="filled">Default</Label>
          <Label color="primary" variant="filled">Primary</Label>
          <Label color="secondary" variant="filled">Secondary</Label>
          <Label color="success" variant="filled">Success</Label>
          <Label color="warning" variant="filled">Warning</Label>
          <Label color="error" variant="filled">Error</Label>
        </Stack>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Soft Variant</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Label color="default" variant="soft">Default</Label>
          <Label color="primary" variant="soft">Primary</Label>
          <Label color="secondary" variant="soft">Secondary</Label>
          <Label color="success" variant="soft">Success</Label>
          <Label color="warning" variant="soft">Warning</Label>
          <Label color="error" variant="soft">Error</Label>
        </Stack>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Outlined Variant</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Label color="default" variant="outlined">Default</Label>
          <Label color="primary" variant="outlined">Primary</Label>
          <Label color="secondary" variant="outlined">Secondary</Label>
          <Label color="success" variant="outlined">Success</Label>
          <Label color="warning" variant="outlined">Warning</Label>
          <Label color="error" variant="outlined">Error</Label>
        </Stack>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Inverted Variant</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Label color="default" variant="inverted">Default</Label>
          <Label color="primary" variant="inverted">Primary</Label>
          <Label color="secondary" variant="inverted">Secondary</Label>
          <Label color="info" variant="inverted">Info</Label>
          <Label color="success" variant="inverted">Success</Label>
          <Label color="warning" variant="inverted">Warning</Label>
          <Label color="error" variant="inverted">Error</Label>
        </Stack>
      </Box>
    </Stack>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Label color="success" startIcon="✓">Completed</Label>
        <Label color="warning" startIcon="⚠️">Warning</Label>
        <Label color="error" startIcon="✕">Failed</Label>
      </Stack>
      
      <Stack direction="row" spacing={1} alignItems="center">
        <Label color="primary" endIcon="→">Next</Label>
        <Label color="secondary" endIcon="↗">External</Label>
        <Label color="success" endIcon="✓">Done</Label>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Label color="primary" startIcon="⭐" endIcon="🔥">Featured</Label>
        <Label color="success" startIcon="🎯" endIcon="✨">Premium</Label>
      </Stack>
    </Stack>
  ),
};

export const StatusLabels: Story = {
  render: () => (
    <Stack spacing={2}>
      <Box>
        <Typography variant="subtitle2" gutterBottom>Order Status</Typography>
        <Stack direction="row" spacing={1}>
          <Label color="warning" variant="soft">Pending</Label>
          <Label color="primary" variant="soft">Processing</Label>
          <Label color="success" variant="filled">Shipped</Label>
          <Label color="success" variant="filled">Delivered</Label>
          <Label color="error" variant="soft">Cancelled</Label>
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>User Roles</Typography>
        <Stack direction="row" spacing={1}>
          <Label color="error" variant="filled">Admin</Label>
          <Label color="primary" variant="filled">Manager</Label>
          <Label color="secondary" variant="soft">Editor</Label>
          <Label color="default" variant="outlined">Viewer</Label>
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>Priority Levels</Typography>
        <Stack direction="row" spacing={1}>
          <Label color="error" variant="filled" startIcon="🔥">Critical</Label>
          <Label color="warning" variant="filled" startIcon="⚡">High</Label>
          <Label color="primary" variant="soft" startIcon="📋">Medium</Label>
          <Label color="default" variant="outlined" startIcon="📝">Low</Label>
        </Stack>
      </Box>
    </Stack>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Stack direction="row" spacing={1}>
      <Label disabled>Disabled Default</Label>
      <Label color="primary" disabled>Disabled Primary</Label>
      <Label color="success" variant="filled" disabled>Disabled Success</Label>
      <Label color="warning" variant="outlined" disabled>Disabled Warning</Label>
    </Stack>
  ),
};

export const TextVariations: Story = {
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Label color="primary">new</Label>
        <Label color="success">ACTIVE</Label>
        <Label color="warning">Beta</Label>
        <Label color="error">deprecated</Label>
      </Stack>
      
      <Stack direction="row" spacing={1} alignItems="center">
        <Label color="primary">v2.1.0</Label>
        <Label color="secondary">React 18</Label>
        <Label color="success">TypeScript</Label>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Label color="primary" variant="outlined">Free</Label>
        <Label color="warning" variant="filled">Pro</Label>
        <Label color="error" variant="filled">Enterprise</Label>
      </Stack>
    </Stack>
  ),
};

export const Interactive: Story = {
  args: {
    children: 'Click me',
    color: 'primary',
    variant: 'soft',
    onClick: () => alert('Label clicked!'),
    style: { cursor: 'pointer' },
  },
};
