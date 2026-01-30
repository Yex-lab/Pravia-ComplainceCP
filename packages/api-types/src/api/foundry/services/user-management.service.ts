import type { createHttpHelpers } from '../../../core/http-helpers';
import type {
  UserProfileDto,
  CreateUserProfileDto,
  UpdateUserProfileDto,
  UpdateOrganizationDto,
  RefreshViewResponseDto,
  CreateUserDto,
  CreateUserResponseDto,
  UpdateUserDto,
  BanUserDto,
  InviteUserDto,
} from '../types';

export const createUserManagementService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    getUserManagementProfiles: (): Promise<any[]> =>
      http.get(`${basePath}/api/user-management/profiles`),

    getUserManagementProfileEmailByEmail: (email: string): Promise<UserProfileDto> =>
      http.get(`${basePath}/api/user-management/profile/email/${email}`),

    getUserManagementByUserIdProfile: (userId: string): Promise<UserProfileDto> =>
      http.get(`${basePath}/api/user-management/${userId}/profile`),

    createUserManagementByUserIdProfile: (
      userId: string,
      data: CreateUserProfileDto,
    ): Promise<UserProfileDto> =>
      http.post(`${basePath}/api/user-management/${userId}/profile`, data),

    updateUserManagementByUserIdProfile: (
      userId: string,
      data: UpdateUserProfileDto,
    ): Promise<UserProfileDto> =>
      http.put(`${basePath}/api/user-management/${userId}/profile`, data),

    deleteUserManagementByUserIdProfile: (userId: string): Promise<void> =>
      http.delete(`${basePath}/api/user-management/${userId}/profile`),

    updateUserManagementByUserIdProfileOrganization: (
      userId: string,
      data: UpdateOrganizationDto,
    ): Promise<UserProfileDto> =>
      http.put(`${basePath}/api/user-management/${userId}/profile/organization`, data),

    createUserManagementAdminUsersRefreshView: (data: any): Promise<RefreshViewResponseDto> =>
      http.post(`${basePath}/api/user-management/admin/users/refresh-view`, data),

    createUserManagementAdminUsers: (data: CreateUserDto): Promise<CreateUserResponseDto> =>
      http.post(`${basePath}/api/user-management/admin/users`, data),

    getUserManagementAdminUsers: (): Promise<any[]> =>
      http.get(`${basePath}/api/user-management/admin/users`),

    getUserManagementAdminUsersOrganizationByOrganizationId: (
      organizationId: string,
    ): Promise<any> =>
      http.get(`${basePath}/api/user-management/admin/users/organization/${organizationId}`),

    getUserManagementAdminUsersById: (id: string): Promise<any> =>
      http.get(`${basePath}/api/user-management/admin/users/${id}`),

    updateUserManagementAdminUsersById: (id: string, data: UpdateUserDto): Promise<any> =>
      http.put(`${basePath}/api/user-management/admin/users/${id}`, data),

    deleteUserManagementAdminUsersById: (id: string): Promise<void> =>
      http.delete(`${basePath}/api/user-management/admin/users/${id}`),

    getUserManagementAdminUsersByIdWithProfile: (id: string): Promise<any> =>
      http.get(`${basePath}/api/user-management/admin/users/${id}/with-profile`),

    createUserManagementAdminUsersByIdResetPassword: (id: string, data: any): Promise<any> =>
      http.post(`${basePath}/api/user-management/admin/users/${id}/reset-password`, data),

    createUserManagementAdminUsersByIdMagicLink: (id: string, data: any): Promise<any> =>
      http.post(`${basePath}/api/user-management/admin/users/${id}/magic-link`, data),

    createUserManagementAdminUsersByIdBan: (id: string, data: BanUserDto): Promise<any> =>
      http.post(`${basePath}/api/user-management/admin/users/${id}/ban`, data),

    createUserManagementAdminUsersByIdUnban: (id: string, data: any): Promise<any> =>
      http.post(`${basePath}/api/user-management/admin/users/${id}/unban`, data),

    createUserManagementAdminUsersByIdRevokeSessions: (id: string, data: any): Promise<any> =>
      http.post(`${basePath}/api/user-management/admin/users/${id}/revoke-sessions`, data),

    createUserManagementAdminUsersInvite: (data: InviteUserDto): Promise<CreateUserResponseDto> =>
      http.post(`${basePath}/api/user-management/admin/users/invite`, data),
  };
};
