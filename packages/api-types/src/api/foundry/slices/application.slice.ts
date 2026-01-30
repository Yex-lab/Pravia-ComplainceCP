import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { ValidateTokenDto } from '../types';

export const createApplicationsSlice = (service: ResourceService<ValidateTokenDto>) => {
  const applicationsQuery = createAppQuery(['applications']);

  const applicationsQueryConfig = {
    queryFn: () => service.listApplications(),
    ...defaultQueryConfig,
  };

  type ApplicationFilters = {
    searchQuery?: string;
  };

  type ApplicationsSlice = QuerySliceState<ValidateTokenDto, ApplicationFilters>;

  const createApplicationsZustandSlice: StateCreator<ApplicationsSlice> = createQuerySlice<
    ValidateTokenDto,
    ApplicationFilters
  >({
    initialFilters: {
      searchQuery: '',
    },
  });

  return {
    query: applicationsQuery,
    queryConfig: applicationsQueryConfig,
    createSlice: createApplicationsZustandSlice,
  };
};
