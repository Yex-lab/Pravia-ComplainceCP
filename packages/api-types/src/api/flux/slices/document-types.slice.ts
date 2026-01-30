import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { ContactResponseDto } from '../types';

export const createDocumentTypesSlice = (service: ResourceService<ContactResponseDto>) => {
  const documentTypesQuery = createAppQuery(['documentTypes']);

  const documentTypesQueryConfig = {
    queryFn: () => service.listDocumentTypes(),
    ...defaultQueryConfig,
  };

  type DocumentTypesFilters = {
    searchQuery?: string;
  };

  type DocumentTypesSlice = QuerySliceState<ContactResponseDto, DocumentTypesFilters>;

  const createDocumentTypesZustandSlice: StateCreator<DocumentTypesSlice> = createQuerySlice<
    ContactResponseDto,
    DocumentTypesFilters
  >({
    initialFilters: {
      searchQuery: '',
    },
  });

  return {
    query: documentTypesQuery,
    queryConfig: documentTypesQueryConfig,
    mutations: {
      create: {
        mutationFn: (data: Partial<ContactResponseDto>) => service.createDocumentType(data),
      },
      update: {
        mutationFn: ({ id, data }: { id: string; data: Partial<ContactResponseDto> }) =>
          service.updateDocumentType(id, data),
      },
      delete: {
        mutationFn: (id: string) => service.deleteDocumentType(id),
      },
    },
    createSlice: createDocumentTypesZustandSlice,
  };
};
