import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ConfirmationDialogProvider, useConfirmationDialog } from './index';

const meta: Meta = {
  title: 'Feedback/Confirmation Dialog',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# ConfirmationDialog

A modern confirmation dialog system using React Context and hooks. Provides a simple API to show confirmation dialogs from anywhere in your application.

## Usage

\`\`\`tsx
// 1. Wrap your app with the provider
<ConfirmationDialogProvider>
  <App />
</ConfirmationDialogProvider>

// 2. Use the hook in any component
const confirm = useConfirmationDialog();

const handleDelete = async () => {
  const confirmed = await confirm({
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    variant: 'danger',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  });
  
  if (confirmed) {
    // Proceed with deletion
    console.log('Item deleted');
  }
};
\`\`\`

## Features

- **Promise-based API** - Returns boolean for confirmed/cancelled
- **Customizable text** - Title, message, button labels
- **Visual variants** - Default, danger, warning styles
- **Keyboard support** - Enter to confirm, Escape to cancel
- **TypeScript support** - Full type safety
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

function ConfirmationDialogDemo() {
  const confirm = useConfirmationDialog();
  const [lastResult, setLastResult] = useState<string>('');

  const handleBasicConfirm = async () => {
    const confirmed = await confirm({
      title: 'Basic Confirmation',
      message: 'This is a basic confirmation dialog. Do you want to proceed?',
    });
    setLastResult(confirmed ? 'Confirmed' : 'Cancelled');
  };

  const handleDangerConfirm = async () => {
    const confirmed = await confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      variant: 'danger',
      confirmText: 'Delete',
      cancelText: 'Keep',
    });
    setLastResult(confirmed ? 'Deleted' : 'Kept');
  };

  const handleWarningConfirm = async () => {
    const confirmed = await confirm({
      title: 'Warning',
      message: 'This action may have unintended consequences. Are you sure you want to continue?',
      variant: 'warning',
      confirmText: 'Continue',
      cancelText: 'Go Back',
    });
    setLastResult(confirmed ? 'Continued' : 'Went Back');
  };

  const handleCustomConfirm = async () => {
    const confirmed = await confirm({
      title: 'Custom Dialog',
      message: 'This dialog has custom button text and uses a smaller width.',
      confirmText: 'Yes, Do It!',
      cancelText: 'No, Stop!',
      maxWidth: 'xs',
    });
    setLastResult(confirmed ? 'Did It!' : 'Stopped!');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
      <Typography variant="h6" gutterBottom>
        Confirmation Dialog Examples
      </Typography>
      
      <Button variant="outlined" onClick={handleBasicConfirm}>
        Basic Confirmation
      </Button>
      
      <Button variant="outlined" color="error" onClick={handleDangerConfirm}>
        Danger Confirmation
      </Button>
      
      <Button variant="outlined" color="warning" onClick={handleWarningConfirm}>
        Warning Confirmation
      </Button>
      
      <Button variant="outlined" onClick={handleCustomConfirm}>
        Custom Confirmation
      </Button>
      
      {lastResult && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Last result: <strong>{lastResult}</strong>
        </Typography>
      )}
    </Box>
  );
}

export const Default: Story = {
  render: () => (
    <ConfirmationDialogProvider>
      <ConfirmationDialogDemo />
    </ConfirmationDialogProvider>
  ),
};
