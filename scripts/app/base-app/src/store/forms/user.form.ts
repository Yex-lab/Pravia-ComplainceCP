import type { FoundryTypes } from '@asyml8/api-types';

import { z } from 'zod';
import { withNotifications, createAppFormStore } from '@asyml8/ui';

import { foundryServices } from 'src/api';

// User form schema
export const userFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['admin', 'user', 'moderator']).optional(),
  active: z.boolean().default(true),
});

export type UserFormData = z.infer<typeof userFormSchema>;

// User form rows configuration
export const userFormRows = [
  {
    fields: [
      {
        name: 'name',
        label: 'Full Name', // Will be translated in component
        type: 'text' as const,
        required: true,
        placeholder: 'Enter full name',
        disabled: true, // Disabled since it's computed
      },
    ],
  },
  {
    fields: [
      {
        name: 'email',
        label: 'Email Address', // Will be translated in component
        type: 'email' as const,
        required: true,
        placeholder: 'Enter email address',
        disabled: true, // Email should not be editable
      },
    ],
  },
  {
    fields: [
      {
        name: 'firstName',
        label: 'First Name', // Will be translated in component
        type: 'text' as const,
        placeholder: 'Enter first name',
      },
      {
        name: 'lastName',
        label: 'Last Name', // Will be translated in component
        type: 'text' as const,
        placeholder: 'Enter last name',
      },
    ],
  },
  {
    fields: [
      {
        name: 'role',
        label: 'Role', // Will be translated in component
        type: 'select' as const,
        options: [
          { value: 'user', label: 'User' },
          { value: 'admin', label: 'Admin' },
          { value: 'moderator', label: 'Moderator' },
        ],
      },
      {
        name: 'active',
        label: 'Active User', // Will be translated in component
        type: 'checkbox' as const,
      },
    ],
  },
];

// Create user form store
export const userFormStore = createAppFormStore({
  schema: userFormSchema,
  fetchFn: async (userId?: string) => {
    if (!userId) return {};

    const userData = await foundryServices.user.getUser(userId);

    return {
      id: userData.id || '',
      name:
        `${userData.firstName ?? ''} ${userData.lastName ?? ''}`.trim() ||
        userData.email?.split('@')[0] ||
        '',
      email: userData.email || '',
      firstName: userData.firstName ?? '',
      lastName: userData.lastName ?? '',
      role: (userData as any).role ?? 'user',
      active: !!(userData as any).emailVerifiedAt,
    };
  },
  createFn: async (data: UserFormData): Promise<any> => {
    const createUserDto: FoundryTypes.CreateUserDto = {
      email: data.email,
      user_metadata: {
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
      },
    };

    return withNotifications(() => foundryServices.user.createUser(createUserDto), {
      loading: 'Creating user...',
      success: 'User created successfully!',
      error: 'Failed to create user. Please try again.',
    });
  },
  updateFn: async (data: UserFormData): Promise<any> => {
    if (!data.id) throw new Error('User ID is required for update');

    // Extract firstName and lastName from name field if they're missing
    let firstName = data.firstName ?? '';
    let lastName = data.lastName ?? '';

    // If firstName/lastName are empty but name exists, split the name
    if ((!firstName || !lastName) && data.name) {
      const nameParts = data.name.trim().split(' ');
      firstName = (firstName || nameParts[0]) ?? '';
      lastName = (lastName || nameParts.slice(1).join(' ')) ?? '';
    }

    const updateProfileDto: FoundryTypes.UpdateUserProfileDto = {
      firstName,
      lastName,
    };

    return withNotifications(() => foundryServices.user.updateUser(data.id, updateProfileDto), {
      loading: 'Updating user...',
      success: 'User updated successfully!',
      error: 'Failed to update user. Please try again.',
    });
  },
  deleteFn: async (id: string) =>
    withNotifications(() => foundryServices.user.deleteUser(id), {
      loading: 'Deleting user...',
      success: 'User deleted successfully!',
      error: 'Failed to delete user. Please try again.',
    }),
  invalidateQueries: [['users-v2'], ['user']],
});
