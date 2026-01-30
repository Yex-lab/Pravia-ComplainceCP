import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { ValidateTokenDto } from '../types';

export const createAuthenticationsSlice = (service: ResourceService<ValidateTokenDto>) => {
  const authenticationsQuery = createAppQuery(['authentications']);

  const authenticationsQueryConfig = {
    queryFn: () => service.listAuthentications(),
    ...defaultQueryConfig,
  };

  type AuthenticationFilters = {
    searchQuery?: string;
  };

  type AuthenticationsSlice = QuerySliceState<ValidateTokenDto, AuthenticationFilters>;

  const createAuthenticationsZustandSlice: StateCreator<AuthenticationsSlice> = createQuerySlice<
    ValidateTokenDto,
    AuthenticationFilters
  >({
    initialFilters: {
      searchQuery: '',
    },
  });

  return {
    query: authenticationsQuery,
    queryConfig: authenticationsQueryConfig,
    mutations: {
      create: {
        mutationFn: (data: Partial<ValidateTokenDto>) => service.createAuthentication(data),
      },
    },
    createSlice: createAuthenticationsZustandSlice,
  };
};
