import type { FoundryTypes } from '@asyml8/api-types';

import { z } from 'zod';
import { withNotifications, createAppFormStore } from '@asyml8/ui';

import { foundryServices } from 'src/api';

// Add user form schema
export const addUserFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['admin', 'user', 'moderator']).default('user'),
  password: z.string().optional(),
  email_confirm: z.boolean().default(false),
});

export type AddUserFormData = z.infer<typeof addUserFormSchema>;

// Add user form fields configuration
export const addUserFormRows = [
  {
    fields: [
      {
        name: 'email',
        label: 'Email Address',
        type: 'email' as const,
        required: true,
        placeholder: 'john.doe@example.com',
      },
    ],
  },
  {
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text' as const,
        placeholder: 'John',
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text' as const,
        placeholder: 'Doe',
      },
    ],
  },
  {
    fields: [
      {
        name: 'role',
        label: 'Role',
        type: 'select' as const,
        options: [
          { value: 'user', label: 'User' },
          { value: 'admin', label: 'Admin' },
          { value: 'moderator', label: 'Moderator' },
        ],
      },
    ],
  },
  {
    fields: [
      {
        name: 'password',
        label: 'Password (Optional)',
        type: 'password' as const,
        placeholder: 'Leave empty to send magic link',
      },
    ],
  },
  {
    fields: [
      {
        name: 'email_confirm',
        label: 'Auto-Confirm User',
        type: 'checkbox' as const,
        helperText: 'Automatically confirm user account without email verification',
      },
    ],
  },
];

// Create add user form store
export const addUserFormStore = createAppFormStore({
  schema: addUserFormSchema,
  fetchFn: async (userId?: string) =>
    // For create mode, return default values
    ({
      role: 'user' as const,
    }),
  createFn: async (data: AddUserFormData): Promise<any> => {
    const createUserDto: FoundryTypes.CreateUserDto = {
      email: data.email,
      password: data.password ?? undefined,
      email_confirm: data.email_confirm,
      user_metadata: {
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
      },
    };

    return withNotifications(() => foundryServices.user.createUser(createUserDto), {
      loading: 'Creating user...',
      success: 'User created successfully!',
      error: (error) => {
        if (error?.message?.includes('email') || error?.message?.includes('already exists')) {
          return 'A user with this email already exists.';
        }
        return 'Failed to create user. Please try again.';
      },
    });
  },
  updateFn: async (data: AddUserFormData): Promise<any> => {
    // For add user dialog, we only create, never update
    throw new Error('Update not supported in add user dialog');
  },
  deleteFn: async (id: string) => {
    // For add user dialog, we don't delete
    throw new Error('Delete not supported in add user dialog');
  },
  invalidateQueries: [['users-v2'], ['user']],
});
