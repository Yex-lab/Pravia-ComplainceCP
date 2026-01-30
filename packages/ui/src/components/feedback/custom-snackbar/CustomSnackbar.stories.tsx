import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';

import { CustomSnackbarProvider } from './custom-snackbar-provider';
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showNotification,
  showExpandableError,
  clearAllNotifications,
  dismissNotification,
} from './utils';

const meta: Meta<typeof CustomSnackbarProvider> = {
  title: 'Feedback/Custom Snackbar',
  component: CustomSnackbarProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Custom Snackbar

A flexible notification system built on MUI Snackbar with theme integration and rich customization options.

## Installation & Setup

\`\`\`bash
npm install @asyml8/ui
\`\`\`

### 1. Wrap your app with the provider:

\`\`\`tsx
import { CustomSnackbarProvider } from '@asyml8/ui';

function App() {
  return (
    <CustomSnackbarProvider maxNotifications={3}>
      <YourAppContent />
    </CustomSnackbarProvider>
  );
}
\`\`\`

### 2. Use notification functions anywhere:

\`\`\`tsx
import { 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo, 
  showNotification 
} from '@asyml8/ui';

// Simple usage
showSuccess('User saved successfully!');
showError('Failed to delete user');
showWarning('This action cannot be undone');
showInfo('New features available');
\`\`\`

## Features

- ✅ **Multiple Types**: Success, Error, Warning, Info with theme colors
- ✅ **Custom Icons**: Default icons per type + custom icon support  
- ✅ **Rich Content**: JSX elements, progress bars, formatted text
- ✅ **Actions**: Configurable buttons with variants and colors
- ✅ **Theme Integration**: Inherits MUI theme colors, typography, spacing
- ✅ **Auto-dismiss**: Configurable duration or persistent notifications
- ✅ **Position Control**: Customizable anchor positions
- ✅ **Queue Management**: Multiple notifications with vertical stacking
- ✅ **Loading States**: Animated icons for async operations

## API Reference

### showNotification(options)

\`\`\`tsx
interface NotificationOptions {
  id?: string;                    // Unique identifier
  type?: 'success' | 'error' | 'warning' | 'info';
  message: ReactNode;             // Content to display
  duration?: number | null;       // Auto-dismiss time (null = persistent)
  icon?: ReactNode;              // Custom icon component
  actions?: NotificationAction[]; // Action buttons
  position?: SnackbarOrigin;     // Position on screen
  closable?: boolean;            // Show close button
  persist?: boolean;             // Don't dismiss on clickaway
}
\`\`\`

### Convenience Functions

\`\`\`tsx
showSuccess(message, options?)    // Green success notification
showError(message, options?)      // Red error notification  
showWarning(message, options?)    // Orange warning notification
showInfo(message, options?)       // Blue info notification
\`\`\`

### Utility Functions

\`\`\`tsx
dismissNotification(id)           // Dismiss specific notification
clearAllNotifications()           // Clear all notifications
useNotifications()                // React hook for component usage
\`\`\`

## Advanced Examples

### Custom Icon & Actions
\`\`\`tsx
import PersonAddIcon from '@mui/icons-material/PersonAdd';

showNotification({
  type: 'success',
  message: 'User added to team',
  icon: <PersonAddIcon />,
  actions: [
    { 
      label: 'View Team', 
      onClick: () => navigate('/team'),
      variant: 'contained'
    },
    { 
      label: 'Undo', 
      onClick: () => undoAction(),
      variant: 'text'
    }
  ]
});
\`\`\`

### Rich Content with Progress
\`\`\`tsx
import LinearProgress from '@mui/material/LinearProgress';

showNotification({
  type: 'info',
  message: (
    <Box>
      <Typography variant="subtitle2">Upload Progress</Typography>
      <LinearProgress variant="determinate" value={75} />
      <Typography variant="caption">3 of 4 files completed</Typography>
    </Box>
  ),
  duration: 8000
});
\`\`\`

### Loading States
\`\`\`tsx
import CircularProgress from '@mui/material/CircularProgress';

// Show loading
const loadingId = showNotification({
  type: 'info',
  message: 'Processing...',
  icon: <CircularProgress size={20} />,
  duration: null
});

// Later, dismiss and show result
dismissNotification(loadingId);
showSuccess('Operation completed!');
\`\`\`

### Persistent Notifications
\`\`\`tsx
showNotification({
  type: 'warning',
  message: 'System maintenance in 5 minutes',
  duration: null,        // Don't auto-dismiss
  persist: true,         // Don't dismiss on clickaway
  actions: [
    { label: 'Dismiss', onClick: () => {} }
  ]
});
\`\`\`

## Customization

### Provider Props
\`\`\`tsx
<CustomSnackbarProvider 
  maxNotifications={5}    // Max visible notifications (default: 3)
>
  <App />
</CustomSnackbarProvider>
\`\`\`

### Position Options
\`\`\`tsx
showNotification({
  message: 'Top right notification',
  position: { vertical: 'top', horizontal: 'right' }
});
\`\`\`

### Action Button Variants
\`\`\`tsx
actions: [
  { 
    label: 'Primary', 
    onClick: () => {},
    variant: 'contained',  // 'text' | 'outlined' | 'contained'
    color: 'primary'       // 'primary' | 'secondary' | 'error' | etc.
  }
]
\`\`\`

## Theme Integration

The component automatically inherits your MUI theme:
- **Colors**: Uses theme palette for success, error, warning, info
- **Typography**: Inherits font family, sizes, weights
- **Spacing**: Uses theme spacing units
- **Breakpoints**: Responsive behavior follows theme breakpoints

## Best Practices

1. **Keep messages concise** - Users scan notifications quickly
2. **Use appropriate types** - Match severity with notification type  
3. **Provide actions when needed** - Give users next steps
4. **Don't overwhelm** - Limit concurrent notifications
5. **Test on mobile** - Ensure notifications work on small screens
6. **Use loading states** - Show progress for async operations
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <CustomSnackbarProvider>
        <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
          <Story />
        </Box>
      </CustomSnackbarProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Demo component for interactive examples
const NotificationDemo = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}>
      <Typography variant="h4" gutterBottom>
        Custom Snackbar Demo
      </Typography>
      
      <Box>
        <Typography variant="h6" gutterBottom>
          Basic Types
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => showSuccess('Operation completed successfully!')}
          >
            Success
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={() => showError('Something went wrong. Please try again.')}
          >
            Error
          </Button>
          <Button 
            variant="contained" 
            color="warning"
            onClick={() => showWarning('This action cannot be undone.')}
          >
            Warning
          </Button>
          <Button 
            variant="contained" 
            color="info"
            onClick={() => showInfo('New features are available in settings.')}
          >
            Info
          </Button>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          With Custom Icons
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => showNotification({
              type: 'success',
              message: 'User added to team',
              icon: <PersonAddIcon />
            })}
          >
            User Added
          </Button>
          <Button 
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => showNotification({
              type: 'info',
              message: 'File uploaded successfully',
              icon: <CloudUploadIcon />
            })}
          >
            Upload Complete
          </Button>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          With Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined"
            onClick={() => showNotification({
              type: 'error',
              message: 'Failed to delete item',
              actions: [
                { 
                  label: 'Retry', 
                  onClick: () => console.log('Retrying...'),
                  variant: 'contained',
                  color: 'error'
                },
                { 
                  label: 'Cancel', 
                  onClick: () => console.log('Cancelled'),
                  variant: 'text'
                }
              ],
              duration: null // Don't auto-dismiss
            })}
          >
            Delete Failed
          </Button>
          <Button 
            variant="outlined"
            onClick={() => showNotification({
              type: 'success',
              message: 'Changes saved',
              actions: [
                { 
                  label: 'Undo', 
                  onClick: () => console.log('Undoing...'),
                  variant: 'text'
                }
              ]
            })}
          >
            Save with Undo
          </Button>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Rich Content
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined"
            onClick={() => showNotification({
              type: 'info',
              message: (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Upload Progress
                  </Typography>
                  <LinearProgress variant="determinate" value={75} sx={{ mb: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    3 of 4 files completed
                  </Typography>
                </Box>
              ),
              duration: 8000
            })}
          >
            Progress Notification
          </Button>
          <Button 
            variant="outlined"
            onClick={() => showNotification({
              type: 'success',
              message: (
                <Box>
                  <Typography variant="subtitle2">
                    Team Invitation Sent
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                    <Chip label="john@example.com" size="small" />
                    <Chip label="jane@example.com" size="small" />
                  </Box>
                </Box>
              )
            })}
          >
            Rich Content
          </Button>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Loading States
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined"
            onClick={() => showNotification({
              type: 'info',
              message: 'Processing your request...',
              icon: <CircularProgress size={20} />,
              duration: null, // Don't auto-dismiss
              actions: [
                { 
                  label: 'Cancel', 
                  onClick: () => console.log('Cancelled'),
                  variant: 'text'
                }
              ]
            })}
          >
            Loading with Cancel
          </Button>
          <Button 
            variant="outlined"
            onClick={() => {
              const id = showNotification({
                type: 'info',
                message: 'Uploading files...',
                icon: <CircularProgress size={20} color="info" />,
                duration: null
              });
              
              // Simulate completion after 3 seconds
              setTimeout(() => {
                dismissNotification(id);
                showSuccess('Upload completed successfully!');
              }, 3000);
            }}
          >
            Auto-Complete Loading
          </Button>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Expandable Error Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined"
            color="error"
            onClick={() => showExpandableError(
              'Multiple errors occurred',
              [
                { service: 'API Gateway', message: 'Connection timeout after 30s' },
                { service: 'Database', message: 'Query execution failed' },
                { service: 'Cache', message: 'Redis connection lost' }
              ],
              {
                onRetry: () => console.log('Retrying...'),
                retryText: 'Retry All'
              }
            )}
          >
            Show Expandable Error
          </Button>
          <Button 
            variant="outlined"
            color="error"
            onClick={() => showExpandableError(
              'Validation failed',
              [
                { service: 'Email', message: 'Invalid email format' },
                { service: 'Password', message: 'Must be at least 8 characters' }
              ]
            )}
          >
            Validation Errors
          </Button>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Persistent Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined"
            onClick={() => showNotification({
              type: 'warning',
              message: 'System maintenance in 5 minutes',
              duration: null,
              persist: true,
              actions: [
                { 
                  label: 'Dismiss', 
                  onClick: () => console.log('Dismissed'),
                  variant: 'text'
                }
              ]
            })}
          >
            Persistent Warning
          </Button>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Multiple Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined"
            onClick={() => {
              showSuccess('First notification');
              setTimeout(() => showInfo('Second notification'), 500);
              setTimeout(() => showWarning('Third notification'), 1000);
            }}
          >
            Show Multiple
          </Button>
          <Button 
            variant="outlined"
            color="error"
            onClick={() => clearAllNotifications()}
          >
            Clear All
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export const Interactive: Story = {
  render: () => <NotificationDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showcasing all notification types and features.',
      },
    },
  },
};

export const BasicTypes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button onClick={() => showSuccess('Success message')}>Success</Button>
      <Button onClick={() => showError('Error message')}>Error</Button>
      <Button onClick={() => showWarning('Warning message')}>Warning</Button>
      <Button onClick={() => showInfo('Info message')}>Info</Button>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Basic notification types with default styling and icons.',
      },
    },
  },
};

export const WithActions: Story = {
  render: () => (
    <Button 
      onClick={() => showNotification({
        type: 'error',
        message: 'Failed to save changes',
        actions: [
          { label: 'Retry', onClick: () => console.log('Retry'), variant: 'contained' },
          { label: 'Cancel', onClick: () => console.log('Cancel') }
        ]
      })}
    >
      Show Error with Actions
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Notifications can include action buttons for user interaction.',
      },
    },
  },
};

export const LoadingStates: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
      <Button 
        onClick={() => showNotification({
          type: 'info',
          message: 'Processing...',
          icon: <CircularProgress size={20} />,
          duration: null
        })}
      >
        Simple Loading
      </Button>
      
      <Button 
        onClick={() => {
          const id = showNotification({
            type: 'info',
            message: 'Saving changes...',
            icon: <CircularProgress size={20} color="primary" />,
            duration: null
          });
          
          setTimeout(() => {
            dismissNotification(id);
            showSuccess('Changes saved successfully!');
          }, 2500);
        }}
      >
        Loading → Success
      </Button>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading notifications with animated CircularProgress icons that can transition to success/error states.',
      },
    },
  },
};

export const Docs: Story = {
  render: () => (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h4" gutterBottom>
        Custom Snackbar Documentation
      </Typography>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Installation
      </Typography>
      <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto' }}>
        <code>{`npm install @asyml8/ui`}</code>
      </Box>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Setup
      </Typography>
      <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto' }}>
        <code>{`import { CustomSnackbarProvider } from '@asyml8/ui';

function App() {
  return (
    <CustomSnackbarProvider>
      <YourAppContent />
    </CustomSnackbarProvider>
  );
}`}</code>
      </Box>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Basic Usage
      </Typography>
      <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto' }}>
        <code>{`import { showSuccess, showError, showWarning, showInfo } from '@asyml8/ui';

// Simple notifications
showSuccess('Operation completed!');
showError('Something went wrong');
showWarning('Please confirm this action');
showInfo('New features available');`}</code>
      </Box>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Advanced Usage
      </Typography>
      <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto' }}>
        <code>{`import { showNotification } from '@asyml8/ui';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

showNotification({
  type: 'success',
  message: 'User added to team',
  icon: <PersonAddIcon />,
  actions: [
    { 
      label: 'View Team', 
      onClick: () => navigate('/team'),
      variant: 'contained'
    }
  ],
  duration: 8000
});`}</code>
      </Box>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Loading States
      </Typography>
      <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto' }}>
        <code>{`import { showNotification, dismissNotification } from '@asyml8/ui';
import CircularProgress from '@mui/material/CircularProgress';

// Show loading
const id = showNotification({
  type: 'info',
  message: 'Processing...',
  icon: <CircularProgress size={20} />,
  duration: null
});

// Later dismiss and show result
dismissNotification(id);
showSuccess('Completed successfully!');`}</code>
      </Box>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        API Reference
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>showNotification(options)</strong> - Main notification function
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>showSuccess(message, options?)</strong> - Success notification
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>showError(message, options?)</strong> - Error notification
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>showWarning(message, options?)</strong> - Warning notification
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>showInfo(message, options?)</strong> - Info notification
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>dismissNotification(id)</strong> - Dismiss specific notification
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>clearAllNotifications()</strong> - Clear all notifications
      </Typography>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete documentation and API reference for the Custom Snackbar component.',
      },
    },
  },
};

export const CustomIcon: Story = {
  render: () => (
    <Button 
      onClick={() => showNotification({
        type: 'success',
        message: 'User deleted successfully',
        icon: <DeleteIcon />
      })}
    >
      Custom Icon
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Override default icons with custom ones.',
      },
    },
  },
};

export const ExpandableErrors: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
      <Button 
        variant="contained"
        color="error"
        onClick={() => showExpandableError(
          'Multiple services failed',
          [
            { service: 'API Gateway', message: 'Connection timeout after 30 seconds' },
            { service: 'Database', message: 'Query execution failed: deadlock detected' },
            { service: 'Cache Service', message: 'Redis connection lost' },
            { service: 'Auth Service', message: 'Token validation failed' }
          ],
          {
            onRetry: () => {
              console.log('Retrying all services...');
              showInfo('Retrying failed services...');
            },
            retryText: 'Retry All Services'
          }
        )}
      >
        Show Multiple Service Errors
      </Button>
      
      <Button 
        variant="outlined"
        color="error"
        onClick={() => showExpandableError(
          'Form validation failed',
          [
            { service: 'Email Field', message: 'Invalid email format' },
            { service: 'Password Field', message: 'Must be at least 8 characters with 1 number' },
            { service: 'Phone Field', message: 'Invalid phone number format' }
          ]
        )}
      >
        Show Validation Errors
      </Button>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Expandable notifications show a summary with an expandable panel containing detailed error information. Perfect for displaying multiple errors or validation failures.',
      },
    },
  },
};
