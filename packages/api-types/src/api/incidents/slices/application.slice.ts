import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { IncidentDto } from '../types';

export const createApplicationsSlice = (service: ResourceService<IncidentDto>) => {
  const applicationsQuery = createAppQuery(['applications']);

  const applicationsQueryConfig = {
    queryFn: () => service.listApplications(),
    ...defaultQueryConfig,
  };

  type ApplicationFilters = {
    searchQuery?: string;
  };

  type ApplicationsSlice = QuerySliceState<IncidentDto, ApplicationFilters>;

  const createApplicationsZustandSlice: StateCreator<ApplicationsSlice> = createQuerySlice<
    IncidentDto,
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
