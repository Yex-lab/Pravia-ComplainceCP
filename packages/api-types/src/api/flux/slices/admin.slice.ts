import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { ContactResponseDto } from '../types';

export const createAdminsSlice = (service: ResourceService<ContactResponseDto>) => {
  const adminsQuery = createAppQuery(['admins']);

  const adminsQueryConfig = {
    queryFn: () => service.listAdmins(),
    ...defaultQueryConfig,
  };

  type AdminFilters = {
    searchQuery?: string;
  };

  type AdminsSlice = QuerySliceState<ContactResponseDto, AdminFilters>;

  const createAdminsZustandSlice: StateCreator<AdminsSlice> = createQuerySlice<
    ContactResponseDto,
    AdminFilters
  >({
    initialFilters: {
      searchQuery: '',
    },
  });

  return {
    query: adminsQuery,
    queryConfig: adminsQueryConfig,
    createSlice: createAdminsZustandSlice,
  };
};
