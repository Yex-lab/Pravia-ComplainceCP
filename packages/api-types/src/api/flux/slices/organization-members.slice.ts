import type { StateCreator } from 'zustand';

import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { ResourceService } from '../../../core/api-services.interface';
import type { ContactResponseDto } from '../types';

export const createOrganizationMembersSlice = (service: ResourceService<ContactResponseDto>) => {
  const organizationMembersQuery = createAppQuery(['organizationMembers']);

  const organizationMembersQueryConfig = {
    queryFn: () => service.listOrganizationMembers(),
    ...defaultQueryConfig,
  };

  type OrganizationMembersFilters = {
    searchQuery?: string;
  };

  type OrganizationMembersSlice = QuerySliceState<ContactResponseDto, OrganizationMembersFilters>;

  const createOrganizationMembersZustandSlice: StateCreator<OrganizationMembersSlice> =
    createQuerySlice<ContactResponseDto, OrganizationMembersFilters>({
      initialFilters: {
        searchQuery: '',
      },
    });

  return {
    query: organizationMembersQuery,
    queryConfig: organizationMembersQueryConfig,
    mutations: {
      create: {
        mutationFn: (data: Partial<ContactResponseDto>) => service.createOrganizationMember(data),
      },
      delete: {
        mutationFn: (id: string) => service.deleteOrganizationMember(id),
      },
    },
    createSlice: createOrganizationMembersZustandSlice,
  };
};
