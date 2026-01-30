import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { ContactResponseDto } from '../types';

export const createDesigneesSlice = (service: ResourceService<ContactResponseDto>) => {
  const designeesQuery = createAppQuery(['designees']);

  const designeesQueryConfig = {
    queryFn: () => service.listDesignees(),
    ...defaultQueryConfig,
  };

  type DesigneesFilters = {
    searchQuery?: string;
  };

  type DesigneesSlice = QuerySliceState<ContactResponseDto, DesigneesFilters>;

  const createDesigneesZustandSlice: StateCreator<DesigneesSlice> = createQuerySlice<
    ContactResponseDto,
    DesigneesFilters
  >({
    initialFilters: {
      searchQuery: '',
    },
  });

  return {
    query: designeesQuery,
    queryConfig: designeesQueryConfig,
    createSlice: createDesigneesZustandSlice,
  };
};
