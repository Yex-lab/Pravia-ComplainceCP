import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { ValidateTokenDto } from '../types';

export const createRolesSlice = (service: ResourceService<ValidateTokenDto>) => {
  const rolesQuery = createAppQuery(['roles']);

  const rolesQueryConfig = {
    queryFn: () => service.listRoles(),
    ...defaultQueryConfig,
  };

  type RolesFilters = {
    searchQuery?: string;
  };

  type RolesSlice = QuerySliceState<ValidateTokenDto, RolesFilters>;

  const createRolesZustandSlice: StateCreator<RolesSlice> = createQuerySlice<
    ValidateTokenDto,
    RolesFilters
  >({
    initialFilters: {
      searchQuery: '',
    },
  });

  return {
    query: rolesQuery,
    queryConfig: rolesQueryConfig,
    mutations: {
      create: {
        mutationFn: (data: Partial<ValidateTokenDto>) => service.createRole(data),
      },
      update: {
        mutationFn: ({ id, data }: { id: string; data: Partial<ValidateTokenDto> }) =>
          service.updateRole(id, data),
      },
      delete: {
        mutationFn: (id: string) => service.deleteRole(id),
      },
    },
    createSlice: createRolesZustandSlice,
  };
};
