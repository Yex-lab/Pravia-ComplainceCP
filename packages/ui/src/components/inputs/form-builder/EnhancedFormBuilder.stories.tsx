import type { Meta, StoryObj } from '@storybook/react-vite';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CircularProgress from '@mui/material/CircularProgress';
import { EnhancedFormBuilder } from './enhanced-form-builder';
import { CustomSnackbarProvider } from '../../feedback/custom-snackbar/custom-snackbar-provider';
import type { FormField, FormFieldRow } from './types';

// Basic form rows for stories
const basicRows: FormFieldRow[] = [
  { fields: [{ id: 'name', name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' }] },
  { fields: [{ id: 'email', name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'Enter email address' }] },
  { fields: [
    { id: 'age', name: 'age', label: 'Age', type: 'number' },
    { id: 'role', name: 'role', label: 'Role', type: 'select', options: [
      { value: 'admin', label: 'Administrator' },
      { value: 'user', label: 'User' },
      { value: 'moderator', label: 'Moderator' }
    ]}
  ]},
  { fields: [{ id: 'active', name: 'active', label: 'Active User', type: 'checkbox' }] }
];

// User schema for validation
const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18 or older'),
  role: z.enum(['admin', 'user', 'moderator']),
  active: z.boolean(),
});

// Mock store that actually works
const createMockFormStore = (mode: 'success' | 'error' | 'loading' = 'success', withNotifications = false) => ({
  useForm: () => useForm({
    resolver: zodResolver(userSchema as any), // Type assertion for v5 compatibility
    defaultValues: {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      role: 'user',
      active: true,
      // Additional fields for mixed column sizes story
      title: 'Senior Developer',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 (555) 123-4567',
      department: 'engineering',
      bio: 'Experienced software developer with expertise in React and TypeScript.',
    },
  }),
  useCreate: () => ({
    mutateAsync: async (data: any) => {
      console.log('Mock create:', data);
      
      if (withNotifications) {
        const { showNotification, showSuccess, dismissNotification } = await import('../../feedback/custom-snackbar/utils');
        const loadingId = showNotification({
          type: 'info',
          message: 'Creating user account...',
          icon: <CircularProgress size={20} color="info" />,
          duration: null,
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        dismissNotification(loadingId);
        showSuccess('User created successfully!');
      }
      
      if (mode === 'error') throw { message: 'Failed to create user' };
      return data;
    },
    isPending: mode === 'loading',
    error: mode === 'error' ? { message: 'Failed to create user' } : null,
  }),
  useUpdate: () => ({
    mutateAsync: async (data: any) => {
      console.log('Mock update:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (mode === 'error') throw { message: 'Failed to update user' };
      return data;
    },
    isPending: mode === 'loading',
    error: mode === 'error' ? { message: 'Failed to update user' } : null,
  }),
  useDelete: () => ({
    mutateAsync: async (id: string) => {
      console.log('Mock delete:', id);
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    isPending: false,
  }),
  schema: userSchema,
});

const meta: Meta<typeof EnhancedFormBuilder> = {
  title: 'Inputs/Form Builder/Enhanced',
  component: EnhancedFormBuilder,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Enhanced FormBuilder

The Enhanced FormBuilder extends the basic FormBuilder with store integration for complete CRUD operations using TanStack Query.

## TanStack Query Integration

The Enhanced FormBuilder uses TanStack Query for data management. Here are the key fields you need to understand:

### Required Store Configuration

\`\`\`tsx
const userFormStore = createFormStore({
  schema: userSchema,                    // Zod validation schema
  queryKey: ['user', userId],           // TanStack Query cache key (optional for forms)
  fetchFn: () => fetchUser(userId),     // Function to fetch existing data (optional)
  createFn: (data) => createUser(data), // Function to create new records
  updateFn: (data) => updateUser(data), // Function to update existing records
  deleteFn: (id) => deleteUser(id),     // Function to delete records (optional)
  invalidateQueries: [['users']],       // Query keys to invalidate after mutations
  onSuccess: () => toast.success('Saved!'), // Success callback (optional)
  onError: (error) => toast.error(error.message), // Error callback (optional)
});
\`\`\`

### TanStack Query vs Store Wrapper Properties

The Enhanced FormBuilder uses our store wrapper that proxies to TanStack Query. Here's what maps where:

#### **Direct TanStack Query Properties** (passed through)
- **queryKey**: Maps directly to TanStack Query's \`queryKey\`
  \`\`\`tsx
  // Our store → TanStack Query
  queryKey: ['user', userId] → useQuery({ queryKey: ['user', userId] })
  \`\`\`
- **fetchFn**: Maps to TanStack Query's \`queryFn\`
  \`\`\`tsx
  // Our store → TanStack Query  
  fetchFn: () => fetchUser(userId) → useQuery({ queryFn: () => fetchUser(userId) })
  \`\`\`

#### **Store Wrapper Properties** (our abstraction layer)
- **createFn/updateFn/deleteFn**: Wrapped in \`useMutation\` calls
  \`\`\`tsx
  // Our store creates mutations internally
  createFn: (data) => createUser(data) → useMutation({ mutationFn: createUser })
  updateFn: (data) => updateUser(data) → useMutation({ mutationFn: updateUser })
  deleteFn: (id) => deleteUser(id) → useMutation({ mutationFn: deleteUser })
  \`\`\`
- **invalidateQueries**: Handled in mutation \`onSuccess\` callbacks
  \`\`\`tsx
  // Our store automatically calls this after successful mutations
  invalidateQueries: [['users']] → queryClient.invalidateQueries({ queryKey: ['users'] })
  \`\`\`
- **onSuccess/onError**: Custom callbacks added to mutation options
  \`\`\`tsx
  // Our store adds these to TanStack's mutation callbacks
  onSuccess: (data) => toast.success('Saved!') → useMutation({ onSuccess: ... })
  \`\`\`

#### **Pure Store Properties** (not TanStack related)
- **schema**: Zod validation schema (our form validation layer)
- **mode**: 'create' or 'update' (our UI state management)

### What TanStack Query Actually Does
- **Caching**: Stores query results by \`queryKey\`
- **Background refetching**: Automatically refetches stale data
- **Mutation management**: Handles loading states, errors, and success
- **Cache invalidation**: Refreshes related queries after mutations

### What Our Store Does
- **Abstracts TanStack complexity**: Provides simple CRUD interface
- **Handles form integration**: Connects mutations to form submission
- **Manages validation**: Integrates Zod schemas with TanStack
- **Automatic cache management**: Invalidates queries without manual setup

## Complete CRUD Example

\`\`\`tsx
import { createFormStore, EnhancedFormBuilder } from '@asyml8/ui';
import { z } from 'zod';

// Example API functions
const fetchUser = async (userId: string) => {
  const response = await fetch(\`/api/users/\${userId}\`);
  return response.json();
};

const createUser = async (userData: any) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
};

const updateUser = async (userData: any) => {
  const response = await fetch(\`/api/users/\${userData.id}\`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
};

const deleteUser = async (userId: string) => {
  await fetch(\`/api/users/\${userId}\`, {
    method: 'DELETE',
  });
};

// Define schema
const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['admin', 'user', 'moderator']),
});

// Create store with TanStack Query integration
const userFormStore = createFormStore({
  schema: userSchema,
  queryKey: ['user', userId],           // Cache key for this specific user
  fetchFn: () => fetchUser(userId),     // Load existing user data
  createFn: (data) => createUser(data), // Create new user
  updateFn: (data) => updateUser(data), // Update existing user
  deleteFn: (id) => deleteUser(id),     // Delete user
  invalidateQueries: [                  // Refresh these caches after changes
    ['users'],                          // Users list cache
    ['user', userId]                    // This user's cache
  ],
  onSuccess: () => toast.success('User saved!'),
  onError: (error) => toast.error(error.message),
});

// Use in component
function UserForm({ userId }: { userId?: string }) {
  const mode = userId ? 'update' : 'create';
  
  return (
    <EnhancedFormBuilder
      fields={userFields}
      store={userFormStore}
      mode={mode}
      entityId={userId}
      description="Manage user account information and permissions."
      onSuccess={() => navigate('/users')}
    />
  );
}
\`\`\`

## Alternative: Using Axios or Custom Service

\`\`\`tsx
import axios from 'axios';

// Using axios
const userAPI = {
  fetch: (id: string) => axios.get(\`/api/users/\${id}\`).then(res => res.data),
  create: (data: any) => axios.post('/api/users', data).then(res => res.data),
  update: (data: any) => axios.put(\`/api/users/\${data.id}\`, data).then(res => res.data),
  delete: (id: string) => axios.delete(\`/api/users/\${id}\`),
};

// Using custom service
import { userService } from './services/userService';

const userFormStore = createFormStore({
  schema: userSchema,
  fetchFn: () => userService.getUser(userId),
  createFn: (data) => userService.createUser(data),
  updateFn: (data) => userService.updateUser(data.id, data),
  deleteFn: (id) => userService.deleteUser(id),
  invalidateQueries: [['users'], ['user', userId]],
});
\`\`\`

## Props

- **store**: Form store with CRUD operations and TanStack Query integration
- **mode**: 'create' or 'update'
- **entityId**: ID for update/delete operations
- **description**: Optional description text under the title
- **onSuccess**: Success callback
- **onError**: Error callback

## Features

- **Automatic Loading**: Shows loading states during operations
- **Error Display**: Automatic error message display
- **Delete Button**: Appears in update mode
- **Validation**: Zod schema validation
- **Cache Integration**: Automatic TanStack Query cache invalidation
- **Description Support**: Optional contextual descriptions
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Enhanced FormBuilder in create mode
 */
export const Create: Story = {
  args: {
    rows: basicRows,
    store: createMockFormStore('success'),
    mode: 'create',
    description: 'Create a new user account with basic profile information and permissions.',
  },
};

/**
 * Enhanced FormBuilder in update mode
 */
export const Update: Story = {
  args: {
    rows: basicRows,
    store: createMockFormStore('success'),
    mode: 'update',
    entityId: 'user-123',
    description: 'Update user account details and permissions. Changes will be saved immediately.',
  },
};

/**
 * Enhanced FormBuilder with loading state
 */
export const Loading: Story = {
  args: {
    rows: basicRows,
    store: createMockFormStore('loading'),
    mode: 'create',
    description: 'Form is processing your request...',
  },
};

/**
 * Enhanced FormBuilder with error state
 */
export const Error: Story = {
  args: {
    rows: basicRows,
    store: createMockFormStore('error'),
    mode: 'create',
    description: 'Please correct the errors below and try again.',
  },
};

/**
 * Enhanced FormBuilder with custom submit labels
 */
export const CustomLabels: Story = {
  args: {
    rows: basicRows,
    store: createMockFormStore('success'),
    mode: 'update',
    submitLabel: 'Save Changes',
    description: 'Customize button labels and descriptions for better UX.',
  },
};

/**
 * Enhanced FormBuilder without description
 */
export const NoDescription: Story = {
  args: {
    rows: basicRows,
    store: createMockFormStore('success'),
    mode: 'create',
  },
};

/**
 * Enhanced FormBuilder with single column layout
 */
export const SingleColumn: Story = {
  args: {
    rows: basicRows,
    store: createMockFormStore('success'),
    mode: 'create',
    description: 'Single column layout for simpler forms or narrow containers.',
  },
};

/**
 * Enhanced FormBuilder with mixed column sizes
 */
export const MixedColumnSizes: Story = {
  args: {
    rows: [
      { fields: [{ id: 'title', name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter title' }] },
      { fields: [
        { id: 'firstName', name: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'Enter first name' },
        { id: 'lastName', name: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Enter last name' }
      ]},
      { fields: [{ id: 'email', name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'Enter email address' }] },
      { fields: [
        { id: 'phone', name: 'phone', label: 'Phone', type: 'text', placeholder: 'Enter phone number' },
        { id: 'department', name: 'department', label: 'Department', type: 'select', options: [
          { value: 'engineering', label: 'Engineering' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'sales', label: 'Sales' },
          { value: 'hr', label: 'Human Resources' }
        ]}
      ]},
      { fields: [{ id: 'bio', name: 'bio', label: 'Biography', type: 'text', placeholder: 'Enter a brief biography' }] }
    ],
    store: createMockFormStore('success'),
    mode: 'create',
    description: 'Form demonstrating mixed column sizes - some fields span full width while others are grouped in rows.',
  },
};

/**
 * Enhanced FormBuilder with notifications - WORKING EXAMPLE
 */
export const WithNotifications: Story = {
  args: {
    rows: basicRows,
    store: createMockFormStore('success', true),
    mode: 'create',
    description: 'Form with notifications. Submit to see snackbar notifications.',
  },
  decorators: [
    (Story) => (
      <CustomSnackbarProvider>
        <Story />
      </CustomSnackbarProvider>
    ),
  ],
};
