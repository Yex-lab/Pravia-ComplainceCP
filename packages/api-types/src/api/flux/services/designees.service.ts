import type { createHttpHelpers } from '../../../core/http-helpers';
import type { DesigneeDto } from '../types';

export const createDesigneesService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    getDesignees: (): Promise<any[]> => http.get(`${basePath}/api/designees`),

    getDesigneesOrganizationByOrganizationId: (organizationId: string): Promise<any> =>
      http.get(`${basePath}/api/designees/organization/${organizationId}`),

    getDesigneesById: (id: string): Promise<DesigneeDto> =>
      http.get(`${basePath}/api/designees/${id}`),
  };
};
