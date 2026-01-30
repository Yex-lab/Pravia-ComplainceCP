import type { createHttpHelpers } from '../../../core/http-helpers';

export const createAdminService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    getAdminTestConfig: (): Promise<any[]> => http.get(`${basePath}/api/admin/test-config`),

    getAdminWhoami: (): Promise<any[]> => http.get(`${basePath}/api/admin/whoami`),

    getAdminEnvironment: (): Promise<any[]> => http.get(`${basePath}/api/admin/environment`),
  };
};
