import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { IncidentDto } from '../types';

export const createIncidentsSlice = (service: ResourceService<IncidentDto>) => {
  const incidentsQuery = createAppQuery(['incidents']);

  const incidentsQueryConfig = {
    queryFn: () => service.listIncidents(),
    ...defaultQueryConfig,
  };

  type IncidentsFilters = {
    searchQuery?: string;
  };

  type IncidentsSlice = QuerySliceState<IncidentDto, IncidentsFilters>;

  const createIncidentsZustandSlice: StateCreator<IncidentsSlice> = createQuerySlice<
    IncidentDto,
    IncidentsFilters
  >({
    initialFilters: {
      searchQuery: '',
    },
  });

  return {
    query: incidentsQuery,
    queryConfig: incidentsQueryConfig,
    mutations: {
      create: {
        mutationFn: (data: Partial<IncidentDto>) => service.createIncident(data),
      },
      update: {
        mutationFn: ({ id, data }: { id: string; data: Partial<IncidentDto> }) =>
          service.updateIncident(id, data),
      },
      delete: {
        mutationFn: (id: string) => service.deleteIncident(id),
      },
    },
    createSlice: createIncidentsZustandSlice,
  };
};
