import type { createHttpHelpers } from '../../../core/http-helpers';
import type {
  ContactResponseDto,
  CreateContactDto,
  ContactWithPermissionsResponseDto,
  CreateContactWithPermissionsDto,
  InviteContactDto,
  UpdateContactWithPermissionsDto,
} from '../types';

export const createContactsService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    createContacts: (data: CreateContactDto): Promise<ContactResponseDto> =>
      http.post(`${basePath}/api/contacts`, data),

    getContacts: (): Promise<ContactResponseDto[]> => http.get(`${basePath}/api/contacts`),

    createContactsWithPermissions: (
      data: CreateContactWithPermissionsDto,
    ): Promise<ContactWithPermissionsResponseDto> =>
      http.post(`${basePath}/api/contacts/with-permissions`, data),

    createContactsInvitePrimary: (data: InviteContactDto): Promise<ContactResponseDto> =>
      http.post(`${basePath}/api/contacts/invite-primary`, data),

    getContactsByEmailByEmail: (email: string): Promise<ContactResponseDto> =>
      http.get(`${basePath}/api/contacts/by-email/${email}`),

    getContactsByAccountByAccountId: (accountId: string): Promise<ContactResponseDto> =>
      http.get(`${basePath}/api/contacts/by-account/${accountId}`),

    getContactsById: (id: string): Promise<ContactResponseDto> =>
      http.get(`${basePath}/api/contacts/${id}`),

    updateContactsById: (
      id: string,
      data: UpdateContactWithPermissionsDto,
    ): Promise<ContactWithPermissionsResponseDto> =>
      http.put(`${basePath}/api/contacts/${id}`, data),

    deleteContactsById: (id: string): Promise<void> =>
      http.delete(`${basePath}/api/contacts/${id}`),

    getContactsPortal: (): Promise<ContactResponseDto[]> =>
      http.get(`${basePath}/api/contacts/portal`),

    createContactsPortal: (data: CreateContactDto): Promise<ContactResponseDto> =>
      http.post(`${basePath}/api/contacts/portal`, data),
  };
};
