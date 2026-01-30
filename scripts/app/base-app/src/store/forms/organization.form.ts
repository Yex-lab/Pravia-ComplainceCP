import { z } from 'zod';
import { withNotifications, createAppFormStore } from '@asyml8/ui';

import { fluxSlices, fluxServices } from 'src/api';
import { ADDRESS_REGEX, NAME_CHARS_REGEX, POSTAL_CODE_REGEX } from 'src/constants';

const accountsQuery = fluxSlices.accounts.query;

// Organization address update schema
export const organizationAddressSchema = z.object({
  id: z.string().optional(),
  // Primary address fields
  addressLine1: z
    .string()
    .max(100, 'Address line 1 must be 100 characters or less')
    .regex(ADDRESS_REGEX, 'Only letters, numbers, spaces, and common punctuation allowed')
    .optional()
    .or(z.literal('')),
  addressLine2: z
    .string()
    .max(100, 'Address line 2 must be 100 characters or less')
    .regex(ADDRESS_REGEX, 'Only letters, numbers, spaces, and common punctuation allowed')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .max(50, 'City must be 50 characters or less')
    .regex(NAME_CHARS_REGEX, 'Only letters, spaces, hyphens and apostrophes allowed')
    .optional()
    .or(z.literal('')),
  state: z
    .string()
    .max(50, 'State must be 50 characters or less')
    .regex(NAME_CHARS_REGEX, 'Only letters, spaces, hyphens and apostrophes allowed')
    .optional()
    .or(z.literal('')),
  postalCode: z
    .string()
    .max(10, 'Postal code must be 10 characters or less')
    .regex(POSTAL_CODE_REGEX, 'Invalid ZIP code format (e.g., 12345 or 12345-6789)')
    .optional()
    .or(z.literal('')),
  county: z
    .string()
    .max(50, 'County must be 50 characters or less')
    .regex(NAME_CHARS_REGEX, 'Only letters, spaces, hyphens and apostrophes allowed')
    .optional()
    .or(z.literal('')),

  // Mailing address fields
  mailingAddressLine1: z
    .string()
    .max(100, 'Address line 1 must be 100 characters or less')
    .regex(ADDRESS_REGEX, 'Only letters, numbers, spaces, and common punctuation allowed')
    .optional()
    .or(z.literal('')),
  mailingAddressLine2: z
    .string()
    .max(100, 'Address line 2 must be 100 characters or less')
    .regex(ADDRESS_REGEX, 'Only letters, numbers, spaces, and common punctuation allowed')
    .optional()
    .or(z.literal('')),
  mailingCity: z
    .string()
    .max(50, 'City must be 50 characters or less')
    .regex(NAME_CHARS_REGEX, 'Only letters, spaces, hyphens and apostrophes allowed')
    .optional()
    .or(z.literal('')),
  mailingState: z
    .string()
    .max(50, 'State must be 50 characters or less')
    .regex(NAME_CHARS_REGEX, 'Only letters, spaces, hyphens and apostrophes allowed')
    .optional()
    .or(z.literal('')),
  mailingPostalCode: z
    .string()
    .max(10, 'Postal code must be 10 characters or less')
    .regex(POSTAL_CODE_REGEX, 'Invalid ZIP code format (e.g., 12345 or 12345-6789)')
    .optional()
    .or(z.literal('')),
  mailingCounty: z
    .string()
    .max(50, 'County must be 50 characters or less')
    .regex(NAME_CHARS_REGEX, 'Only letters, spaces, hyphens and apostrophes allowed')
    .optional()
    .or(z.literal('')),
});

export type OrganizationAddressFormData = z.infer<typeof organizationAddressSchema>;

// Create organization address form store
export const organizationAddressStore = createAppFormStore({
  schema: organizationAddressSchema,
  fetchFn: async (accountId?: string) => {
    if (!accountId) return {};
    const result = await fluxServices.accounts.getAccountsById(accountId);
    return result;
  },
  createFn: async () => {
    throw new Error('Create not supported for organization addresses');
  },
  updateFn: async (data: OrganizationAddressFormData & { id?: string }) => {
    if (!data.id) throw new Error('Account ID is required for update');

    const { id, ...updateData } = data;

    const updated = await withNotifications(
      () => fluxServices.accounts.updateAccountsById(id, updateData),
      {
        loading: 'Updating address...',
        success: 'Address updated successfully!',
        error: 'Failed to update address. Please try again.',
      }
    );

    // Update Zustand store after successful mutation
    const { useAppStore } = await import('src/store/app.store');
    const store = useAppStore.getState();
    const updatedAccounts = store.slices.accounts.data.map((acc) =>
      acc.id === id ? { ...acc, ...updated } : acc
    );
    store.slices.accounts.setData(updatedAccounts);

    return updated;
  },
  deleteFn: async () => {
    throw new Error('Delete not supported for organization addresses');
  },
  invalidateQueries: [accountsQuery],
});
