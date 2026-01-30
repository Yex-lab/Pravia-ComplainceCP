import type { createHttpHelpers } from '../../../core/http-helpers';

export const createApplicationService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    getApi: (): Promise<any[]> => http.get(`${basePath}/api`),
  };
};
