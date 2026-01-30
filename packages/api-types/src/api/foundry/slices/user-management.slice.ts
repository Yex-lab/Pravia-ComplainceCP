import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { ValidateTokenDto } from '../types';

export const createUserManagementsSlice = (service: ResourceService<ValidateTokenDto>) => {
  const userManagementsQuery = createAppQuery(['userManagements']);

  const userManagementsQueryConfig = {
    queryFn: () => service.listUserManagements(),
    ...defaultQueryConfig,
  };

  type UserManagementFilters = {
    searchQuery?: string;
  };

  type UserManagementsSlice = QuerySliceState<ValidateTokenDto, UserManagementFilters>;

  const createUserManagementsZustandSlice: StateCreator<UserManagementsSlice> = createQuerySlice<
    ValidateTokenDto,
    UserManagementFilters
  >({
    initialFilters: {
      searchQuery: '',
    },
  });

  return {
    query: userManagementsQuery,
    queryConfig: userManagementsQueryConfig,
    mutations: {
      create: {
        mutationFn: (data: Partial<ValidateTokenDto>) => service.createUserManagement(data),
      },
      update: {
        mutationFn: ({ id, data }: { id: string; data: Partial<ValidateTokenDto> }) =>
          service.updateUserManagement(id, data),
      },
      delete: {
        mutationFn: (id: string) => service.deleteUserManagement(id),
      },
    },
    createSlice: createUserManagementsZustandSlice,
  };
};
