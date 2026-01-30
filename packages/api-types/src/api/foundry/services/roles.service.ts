import type { createHttpHelpers } from '../../../core/http-helpers';
import type { RoleDto, CreateRoleDto, UpdateRoleDto } from '../types';

export const createRolesService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    getRoles: (): Promise<any[]> => http.get(`${basePath}/api/roles`),

    createRoles: (data: CreateRoleDto): Promise<RoleDto> =>
      http.post(`${basePath}/api/roles`, data),

    getRolesUniversal: (): Promise<any[]> => http.get(`${basePath}/api/roles/universal`),

    getRolesById: (id: string): Promise<RoleDto> => http.get(`${basePath}/api/roles/${id}`),

    updateRolesById: (id: string, data: UpdateRoleDto): Promise<RoleDto> =>
      http.put(`${basePath}/api/roles/${id}`, data),

    deleteRolesById: (id: string): Promise<void> => http.delete(`${basePath}/api/roles/${id}`),
  };
};
