import type { createHttpHelpers } from '../../../core/http-helpers';
import type {
  OrganizationContactRoleDto,
  OrganizationContactDocumentDto,
  CreateOrganizationContactRoleDto,
  CreateOrganizationContactDocumentDto,
} from '../types';

export const createOrganizationMembersService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    getOrganizationMembersRoles: (): Promise<OrganizationContactRoleDto[]> =>
      http.get(`${basePath}/api/organization-members/roles`),

    createOrganizationMembersRoles: (
      data: CreateOrganizationContactRoleDto,
    ): Promise<OrganizationContactRoleDto> =>
      http.post(`${basePath}/api/organization-members/roles`, data),

    getOrganizationMembersRolesOrganizationByOrganizationId: (
      organizationId: string,
    ): Promise<OrganizationContactRoleDto> =>
      http.get(`${basePath}/api/organization-members/roles/organization/${organizationId}`),

    getOrganizationMembersRolesOrganizationByOrganizationIdContactByContactId: (
      organizationId: string,
      contactId: string,
    ): Promise<OrganizationContactRoleDto> =>
      http.get(
        `${basePath}/api/organization-members/roles/organization/${organizationId}/contact/${contactId}`,
      ),

    getOrganizationMembersRolesById: (id: string): Promise<OrganizationContactRoleDto> =>
      http.get(`${basePath}/api/organization-members/roles/${id}`),

    deleteOrganizationMembersRolesById: (id: string): Promise<void> =>
      http.delete(`${basePath}/api/organization-members/roles/${id}`),

    getOrganizationMembersDocuments: (): Promise<OrganizationContactDocumentDto[]> =>
      http.get(`${basePath}/api/organization-members/documents`),

    createOrganizationMembersDocuments: (
      data: CreateOrganizationContactDocumentDto,
    ): Promise<OrganizationContactDocumentDto> =>
      http.post(`${basePath}/api/organization-members/documents`, data),

    getOrganizationMembersDocumentsOrganizationByOrganizationId: (
      organizationId: string,
    ): Promise<OrganizationContactDocumentDto> =>
      http.get(`${basePath}/api/organization-members/documents/organization/${organizationId}`),

    getOrganizationMembersDocumentsOrganizationByOrganizationIdContactByContactId: (
      organizationId: string,
      contactId: string,
    ): Promise<OrganizationContactDocumentDto> =>
      http.get(
        `${basePath}/api/organization-members/documents/organization/${organizationId}/contact/${contactId}`,
      ),

    getOrganizationMembersDocumentsById: (id: string): Promise<OrganizationContactDocumentDto> =>
      http.get(`${basePath}/api/organization-members/documents/${id}`),

    deleteOrganizationMembersDocumentsById: (id: string): Promise<void> =>
      http.delete(`${basePath}/api/organization-members/documents/${id}`),
  };
};
