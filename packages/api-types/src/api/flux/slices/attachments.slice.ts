import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { ContactResponseDto } from '../types';

export const createAttachmentsSlice = (service: ResourceService<ContactResponseDto>) => {
  const attachmentsQuery = createAppQuery(['attachments']);

  const attachmentsQueryConfig = {
    queryFn: () => service.listAttachments(),
    ...defaultQueryConfig,
  };

  type AttachmentsFilters = {
    searchQuery?: string;
  };

  type AttachmentsSlice = QuerySliceState<ContactResponseDto, AttachmentsFilters>;

  const createAttachmentsZustandSlice: StateCreator<AttachmentsSlice> = createQuerySlice<
    ContactResponseDto,
    AttachmentsFilters
  >({
    initialFilters: {
      searchQuery: '',
    },
  });

  return {
    query: attachmentsQuery,
    queryConfig: attachmentsQueryConfig,
    mutations: {
      create: {
        mutationFn: (data: Partial<ContactResponseDto>) => service.createAttachment(data),
      },
      delete: {
        mutationFn: (id: string) => service.deleteAttachment(id),
      },
    },
    createSlice: createAttachmentsZustandSlice,
  };
};
