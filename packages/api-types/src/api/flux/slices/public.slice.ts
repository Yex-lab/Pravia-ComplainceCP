import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { ContactResponseDto } from '../types';

export const createPublicsSlice = (service: ResourceService<ContactResponseDto>) => {
  const publicsQuery = createAppQuery(['publics']);

  const publicsQueryConfig = {
    queryFn: () => service.listPublics(),
    ...defaultQueryConfig,
  };

  type PublicFilters = {
    searchQuery?: string;
  };

  type PublicsSlice = QuerySliceState<ContactResponseDto, PublicFilters>;

  const createPublicsZustandSlice: StateCreator<PublicsSlice> = createQuerySlice<
    ContactResponseDto,
    PublicFilters
  >({
    initialFilters: {
      searchQuery: '',
    },
  });

  return {
    query: publicsQuery,
    queryConfig: publicsQueryConfig,
    mutations: {
      create: {
        mutationFn: (data: Partial<ContactResponseDto>) => service.createPublic(data),
      },
    },
    createSlice: createPublicsZustandSlice,
  };
};
