import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { ContactResponseDto } from '../types';

export const createDocumentUrlsSlice = (service: ResourceService<ContactResponseDto>) => {
  const documentUrlsQuery = createAppQuery(['documentUrls']);

  const documentUrlsQueryConfig = {
    queryFn: () => service.listDocumentUrls(),
    ...defaultQueryConfig,
  };

  type DocumentUrlsFilters = {
    searchQuery?: string;
  };

  type DocumentUrlsSlice = QuerySliceState<ContactResponseDto, DocumentUrlsFilters>;

  const createDocumentUrlsZustandSlice: StateCreator<DocumentUrlsSlice> = createQuerySlice<
    ContactResponseDto,
    DocumentUrlsFilters
  >({
    initialFilters: {
      searchQuery: '',
    },
  });

  return {
    query: documentUrlsQuery,
    queryConfig: documentUrlsQueryConfig,
    createSlice: createDocumentUrlsZustandSlice,
  };
};
