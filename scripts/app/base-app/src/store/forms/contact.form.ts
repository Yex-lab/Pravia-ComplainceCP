import { z } from 'zod';
import { parsePhone, withNotifications, parseBusinessPhone, createAppFormStore } from '@asyml8/ui';

import { fluxSlices, fluxServices } from 'src/api';
import { JOB_TITLE_REGEX, NAME_CHARS_REGEX } from 'src/constants';

const contactsQuery = fluxSlices.contacts.query;

// Lazy import to avoid circular dependency
let appStore: any;
const getAppStore = async () => {
  if (!appStore) {
    const module = await import('src/store/app.store');
    appStore = module.useAppStore;
  }
  return appStore;
};

// Contact form schema
export const contactFormSchema = z.object({
  id: z.string().optional(),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .regex(NAME_CHARS_REGEX, 'Only letters, spaces, hyphens and apostrophes allowed'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .regex(NAME_CHARS_REGEX, 'Only letters, spaces, hyphens and apostrophes allowed'),
  email: z.string().email('Invalid email address'),
  businessPhone: z.string().optional(),
  mobilePhone: z.string().optional(),
  jobTitle: z
    .string()
    .max(60, 'Job title must be 60 characters or less')
    .regex(JOB_TITLE_REGEX, 'Only letters, numbers, spaces, and common punctuation allowed')
    .optional()
    .or(z.literal('')),
  roles: z.array(z.string()).optional().nullable(),
  authorizedDocumentTypes: z.array(z.string()).optional().nullable(),
  organizationId: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Create contact form store
export const contactFormStore = createAppFormStore({
  schema: contactFormSchema,
  fetchFn: async (contactId?: string) => {
    if (!contactId) return {};
    const result = await fluxServices.contacts.getContactsById(contactId);
    return result;
  },
  createFn: async (data: ContactFormData) => {
    const { phone, extension } = parseBusinessPhone(data.businessPhone);
    const mobile = parsePhone(data.mobilePhone);

    const response = await withNotifications(
      async () =>
        fluxServices.contacts.createContactsWithPermissions({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone,
          businessPhoneExtension: extension,
          mobilePhone: mobile,
          jobTitle: data.jobTitle,
          organizationId: data.organizationId,
          roleIds: data.roles,
          documentTypeIds: data.authorizedDocumentTypes,
        }),
      {
        loading: 'Creating contact...',
        success: 'Contact created successfully!',
        error: (error) => {
          if (error?.message?.includes('email') || error?.message?.includes('already exists')) {
            return 'A contact with this email already exists.';
          }
          return 'Failed to create contact. Please try again.';
        },
      }
    );

    // Update store after successful creation
    const useAppStore = await getAppStore();
    const store = useAppStore.getState();

    // Add contact to contacts slice
    store.slices.contacts.setData([...store.slices.contacts.data, response]);

    // Add organizationRoles to organizationRoles slice
    if (response.organizationRoles && response.organizationRoles.length > 0) {
      store.slices.organizationRoles.setData([
        ...store.slices.organizationRoles.data,
        ...response.organizationRoles,
      ]);
    }

    // Add organizationDocuments to organizationDocuments slice
    if (response.organizationDocuments && response.organizationDocuments.length > 0) {
      store.slices.organizationDocuments.setData([
        ...store.slices.organizationDocuments.data,
        ...response.organizationDocuments,
      ]);
    }

    return response;
  },
  updateFn: async (data: ContactFormData) => {
    if (!data.id) throw new Error('Contact ID is required for update');

    const updated = await withNotifications(
      async () => {
        const { phone, extension } = parseBusinessPhone(data.businessPhone);
        const mobile = parsePhone(data.mobilePhone);

        return fluxServices.contacts.updateContactsById(data.id!, {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone,
          businessPhoneExtension: extension,
          mobilePhone: mobile,
          jobTitle: data.jobTitle,
          organizationId: data.organizationId,
          roleIds: data.roles,
          documentTypeIds: data.authorizedDocumentTypes,
        });
      },
      {
        loading: 'Updating contact...',
        success: 'Contact updated successfully!',
        error: (error) => {
          if (error?.message?.includes('email') || error?.message?.includes('already exists')) {
            return 'A contact with this email already exists.';
          }
          return 'Failed to update contact. Please try again.';
        },
      }
    );

    // Update store after successful mutation
    const useAppStore = await getAppStore();
    const store = useAppStore.getState();

    // Update contact in contacts slice
    const updatedContacts = store.slices.contacts.data.map((c) =>
      c.id === updated.id ? { ...c, ...updated } : c
    );
    store.slices.contacts.setData(updatedContacts);

    // Replace organizationRoles for this contact
    if (updated.organizationRoles) {
      const otherRoles = store.slices.organizationRoles.data.filter(
        (r: any) => r.contactId !== updated.id
      );
      store.slices.organizationRoles.setData([...otherRoles, ...updated.organizationRoles]);
    }

    // Replace organizationDocuments for this contact
    if (updated.organizationDocuments) {
      const otherDocs = store.slices.organizationDocuments.data.filter(
        (d: any) => d.contactId !== updated.id
      );
      store.slices.organizationDocuments.setData([...otherDocs, ...updated.organizationDocuments]);
    }

    return updated;
  },
  deleteFn: async (id: string) =>
    withNotifications(() => fluxServices.contacts.deleteContactsById(id), {
      loading: 'Deleting contact...',
      success: 'Contact deleted successfully!',
      error: 'Failed to delete contact. Please try again.',
    }),
  invalidateQueries: [contactsQuery],
});
