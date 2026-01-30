import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { IncidentDto } from '../types';

export const createAdminsSlice = (service: ResourceService<IncidentDto>) => {
  const adminsQuery = createAppQuery(['admins']);

  const adminsQueryConfig = {
    queryFn: () => service.listAdmins(),
    ...defaultQueryConfig,
  };

  type AdminFilters = {
    searchQuery?: string;
  };

  type AdminsSlice = QuerySliceState<IncidentDto, AdminFilters>;

  const createAdminsZustandSlice: StateCreator<AdminsSlice> = createQuerySlice<
    IncidentDto,
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
