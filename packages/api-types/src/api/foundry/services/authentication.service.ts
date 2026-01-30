import type { createHttpHelpers } from '../../../core/http-helpers';
import type { ValidateTokenDto, RefreshTokenDto } from '../types';

export const createAuthenticationService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    createAuthValidate: (data: ValidateTokenDto): Promise<any> =>
      http.post(`${basePath}/api/auth/validate`, data),

    createAuthRefresh: (data: RefreshTokenDto): Promise<any> =>
      http.post(`${basePath}/api/auth/refresh`, data),

    getAuthMe: (): Promise<any[]> => http.get(`${basePath}/api/auth/me`),

    createAuthLogout: (data: any): Promise<any> => http.post(`${basePath}/api/auth/logout`, data),
  };
};
