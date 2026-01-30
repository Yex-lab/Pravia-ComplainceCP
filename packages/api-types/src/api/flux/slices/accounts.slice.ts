import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { ContactResponseDto } from '../types';

export const createAccountsSlice = (service: ResourceService<ContactResponseDto>) => {
  const accountsQuery = createAppQuery(['accounts']);

  const accountsQueryConfig = {
    queryFn: () => service.listAccounts(),
    ...defaultQueryConfig,
  };

  type AccountsFilters = {
    searchQuery?: string;
  };

  type AccountsSlice = QuerySliceState<ContactResponseDto, AccountsFilters>;

  const createAccountsZustandSlice: StateCreator<AccountsSlice> = createQuerySlice<
    ContactResponseDto,
    AccountsFilters
  >({
    initialFilters: {
      searchQuery: '',
    },
  });

  return {
    query: accountsQuery,
    queryConfig: accountsQueryConfig,
    mutations: {
      create: {
        mutationFn: (data: Partial<ContactResponseDto>) => service.createAccount(data),
      },
      update: {
        mutationFn: ({ id, data }: { id: string; data: Partial<ContactResponseDto> }) =>
          service.updateAccount(id, data),
      },
      delete: {
        mutationFn: (id: string) => service.deleteAccount(id),
      },
    },
    createSlice: createAccountsZustandSlice,
  };
};
