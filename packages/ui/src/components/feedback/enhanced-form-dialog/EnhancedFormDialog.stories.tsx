import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@mui/material';
import { z } from 'zod';
import { EnhancedFormDialog } from './enhanced-form-dialog';
import { createFormStore } from '../../../utils/form-store';

const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['admin', 'user']).default('user'),
  active: z.boolean().default(true),
});

const userRows = [
  { fields: [{ name: 'name', label: 'Full Name', type: 'text' as const }] },
  { fields: [{ name: 'email', label: 'Email', type: 'email' as const }] },
  { fields: [{ name: 'role', label: 'Role', type: 'select' as const, options: [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' }
  ]}] },
  { fields: [{ name: 'active', label: 'Active', type: 'switch' as const }] }
];

const mockUserStore = createFormStore({
  schema: userSchema,
  queryKey: ['users'],
  fetchFn: async () => ({ id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' as const, active: true }),
  createFn: async (data: any) => ({ ...data, id: Date.now().toString() }),
  updateFn: async (data: any) => ({ ...data, id: '1' }),
  deleteFn: async (id: string) => ({ id }),
});

const meta: Meta<typeof EnhancedFormDialog> = {
  title: 'Feedback/Enhanced Form Dialog',
  component: EnhancedFormDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A dialog component that combines CustomDialog with EnhancedFormBuilder for seamless form dialogs with integrated store management.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EnhancedFormDialog>;

function DialogWrapper({ mode, user }: { mode: 'create' | 'update', user?: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open {mode === 'create' ? 'Create' : 'Edit'} Dialog
      </Button>
      <EnhancedFormDialog
        open={open}
        onClose={() => setOpen(false)}
        title={mode === 'create' ? 'Create User' : 'Edit User'}
        description={mode === 'create' 
          ? 'Create a new user account with basic information.' 
          : 'Update user account details and permissions.'
        }
        store={mockUserStore}
        rows={userRows}
        mode={mode}
        entityId={user?.id}
        onSuccess={() => console.log('Form submitted successfully!')}
      />
    </>
  );
}

export const CreateMode: Story = {
  render: () => <DialogWrapper mode="create" />,
};

export const UpdateMode: Story = {
  render: () => (
    <DialogWrapper 
      mode="update" 
      user={{ id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', active: true }}
    />
  ),
};

export const MixedColumnWidths: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    
    const mixedWidthRows = [
      { fields: [{ name: 'title', label: 'Title', type: 'text' as const, width: 2 }] },
      { fields: [
        { name: 'firstName', label: 'First Name', type: 'text' as const, width: 1 },
        { name: 'lastName', label: 'Last Name', type: 'text' as const, width: 1 }
      ]},
      { fields: [{ name: 'email', label: 'Email Address', type: 'email' as const, width: 2 }] },
      { fields: [
        { name: 'phone', label: 'Phone', type: 'text' as const, width: 1 },
        { name: 'department', label: 'Department', type: 'select' as const, width: 1, options: [
          { value: 'engineering', label: 'Engineering' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'sales', label: 'Sales' }
        ]}
      ]},
      { fields: [{ name: 'bio', label: 'Biography', type: 'text' as const, width: 2 }] }
    ];
    
    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Mixed Columns Dialog
        </Button>
        <EnhancedFormDialog
          open={open}
          onClose={() => setOpen(false)}
          title="Employee Information"
          description="Form demonstrating mixed column widths - some fields span full width while others use half width."
          store={mockUserStore}
          rows={mixedWidthRows}
          mode="create"
          maxWidth="md"
          onSuccess={() => console.log('Mixed columns form submitted!')}
        />
      </>
    );
  },
};

export const CustomLabels: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    
    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Custom Labels Dialog
        </Button>
        <EnhancedFormDialog
          open={open}
          onClose={() => setOpen(false)}
          title="Custom User Form"
          description="This dialog demonstrates custom button labels and sizing."
          store={mockUserStore}
          rows={userRows}
          mode="create"
          maxWidth="lg"
          submitLabel="Add User"
          cancelLabel="Discard"
          onSuccess={() => console.log('Custom form submitted!')}
        />
      </>
    );
  },
};
