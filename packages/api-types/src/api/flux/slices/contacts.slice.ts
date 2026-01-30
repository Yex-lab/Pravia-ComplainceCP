import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { ContactResponseDto } from '../types';

export const createContactsSlice = (service: ResourceService<ContactResponseDto>) => {
  const contactsQuery = createAppQuery(['contacts']);

  const contactsQueryConfig = {
    queryFn: () => service.listContacts(),
    ...defaultQueryConfig,
  };

  type ContactsFilters = {
    searchQuery?: string;
  };

  type ContactsSlice = QuerySliceState<ContactResponseDto, ContactsFilters>;

  const createContactsZustandSlice: StateCreator<ContactsSlice> = createQuerySlice<
    ContactResponseDto,
    ContactsFilters
  >({
    initialFilters: {
      searchQuery: '',
    },
  });

  return {
    query: contactsQuery,
    queryConfig: contactsQueryConfig,
    mutations: {
      create: {
        mutationFn: (data: Partial<ContactResponseDto>) => service.createContact(data),
      },
      update: {
        mutationFn: ({ id, data }: { id: string; data: Partial<ContactResponseDto> }) =>
          service.updateContact(id, data),
      },
      delete: {
        mutationFn: (id: string) => service.deleteContact(id),
      },
    },
    createSlice: createContactsZustandSlice,
  };
};
