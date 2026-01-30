import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { CustomDialog } from './custom-dialog';

const meta: Meta<typeof CustomDialog> = {
  title: 'Feedback/Custom Dialog',
  component: CustomDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A flexible dialog component built on top of MUI Dialog with customizable title, description, actions, and content areas.

## Basic Usage

\`\`\`tsx
import { CustomDialog } from '@asyml8/ui';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <CustomDialog
        open={open}
        onClose={() => setOpen(false)}
        title="My Dialog"
      >
        <p>Dialog content goes here</p>
      </CustomDialog>
    </>
  );
}
\`\`\`

## Props

### Core Props
- **open**: \`boolean\` - Controls dialog visibility (required)
- **onClose**: \`() => void\` - Called when dialog should close (required)
- **children**: \`React.ReactNode\` - Dialog content

### Layout Props
- **maxWidth**: \`'xs' | 'sm' | 'md' | 'lg' | 'xl'\` - Maximum dialog width (default: 'sm')
- **fullWidth**: \`boolean\` - Takes full width up to maxWidth (default: true)

### Header Props
- **title**: \`string\` - Dialog title text
- **description**: \`string\` - Subtitle/description text below title
- **showCloseButton**: \`boolean\` - Show close button in header (default: true)
- **closeIcon**: \`React.ReactNode\` - Custom close button icon

### Action Props
- **actions**: \`React.ReactNode\` - Action buttons in footer

## Size Guidelines
- **xs (444px)**: Small alerts, confirmations
- **sm (600px)**: Default, simple forms
- **md (900px)**: Complex forms, user profiles
- **lg (1200px)**: Data tables, dashboards
- **xl (1536px)**: Full-screen content

## Integration with Forms

\`\`\`tsx
<CustomDialog
  open={formOpen}
  onClose={() => setFormOpen(false)}
  title="User Form"
  description="Manage user account information."
  maxWidth="md"
>
  <EnhancedFormBuilder
    fields={userFields}
    store={userFormStore}
    mode="create"
  />
</CustomDialog>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle dialog state
const DialogWrapper = ({ children, ...args }: any) => {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <CustomDialog
        {...args}
        open={open}
        onClose={() => setOpen(false)}
      >
        {children}
      </CustomDialog>
    </>
  );
};

/**
 * Basic dialog with title and content
 */
export const Basic: Story = {
  render: (args) => (
    <DialogWrapper {...args}>
      <Box sx={{ p: 2 }}>
        <p>This is a basic dialog with some content.</p>
      </Box>
    </DialogWrapper>
  ),
  args: {
    title: 'Basic Dialog',
  },
};

/**
 * Dialog with title, description, and actions
 */
export const WithActions: Story = {
  render: (args) => (
    <DialogWrapper 
      {...args}
      actions={
        <>
          <Button>Cancel</Button>
          <Button variant="contained">Save</Button>
        </>
      }
    >
      <TextField
        fullWidth
        label="Name"
        defaultValue="John Doe"
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Email"
        defaultValue="john@example.com"
      />
    </DialogWrapper>
  ),
  args: {
    title: 'Edit User',
    description: 'Update user account details and permissions.',
  },
};

/**
 * Large dialog with form content
 */
export const Large: Story = {
  render: (args) => (
    <DialogWrapper 
      {...args}
      actions={
        <>
          <Button>Cancel</Button>
          <Button variant="contained">Create</Button>
        </>
      }
    >
      <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField fullWidth label="First Name" />
        <TextField fullWidth label="Last Name" />
        <TextField fullWidth label="Email" type="email" />
        <TextField fullWidth label="Phone" />
        <TextField fullWidth label="Company" />
        <TextField fullWidth label="Role" />
      </Box>
    </DialogWrapper>
  ),
  args: {
    title: 'Create New User',
    description: 'Fill in the details to create a new user account.',
    maxWidth: 'md',
  },
};

/**
 * Dialog without close button
 */
export const NoCloseButton: Story = {
  render: (args) => (
    <DialogWrapper 
      {...args}
      actions={
        <Button variant="contained">OK</Button>
      }
    >
      <p>This dialog doesn't have a close button in the header.</p>
    </DialogWrapper>
  ),
  args: {
    title: 'Confirmation',
    showCloseButton: false,
  },
};

/**
 * Dialog with only content (no title)
 */
export const ContentOnly: Story = {
  render: (args) => (
    <DialogWrapper 
      {...args}
      actions={
        <>
          <Button>Cancel</Button>
          <Button variant="contained">Confirm</Button>
        </>
      }
    >
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <h3>Are you sure?</h3>
        <p>This action cannot be undone.</p>
      </Box>
    </DialogWrapper>
  ),
  args: {},
};
