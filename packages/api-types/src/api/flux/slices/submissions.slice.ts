import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { ContactResponseDto } from '../types';

export const createSubmissionsSlice = (service: ResourceService<ContactResponseDto>) => {
  const submissionsQuery = createAppQuery(['submissions']);

  const submissionsQueryConfig = {
    queryFn: () => service.listSubmissions(),
    ...defaultQueryConfig,
  };

  type SubmissionsFilters = {
    searchQuery?: string;
  };

  type SubmissionsSlice = QuerySliceState<ContactResponseDto, SubmissionsFilters>;

  const createSubmissionsZustandSlice: StateCreator<SubmissionsSlice> = createQuerySlice<
    ContactResponseDto,
    SubmissionsFilters
  >({
    initialFilters: {
      searchQuery: '',
    },
  });

  return {
    query: submissionsQuery,
    queryConfig: submissionsQueryConfig,
    mutations: {
      create: {
        mutationFn: (data: Partial<ContactResponseDto>) => service.createSubmission(data),
      },
      update: {
        mutationFn: ({ id, data }: { id: string; data: Partial<ContactResponseDto> }) =>
          service.updateSubmission(id, data),
      },
      delete: {
        mutationFn: (id: string) => service.deleteSubmission(id),
      },
    },
    createSlice: createSubmissionsZustandSlice,
  };
};
