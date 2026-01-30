import type { AxiosInstance } from 'axios';

import type { ApiServices } from '../../../core/api-services.interface';
import { createHttpHelpers } from '../../../core/http-helpers';

export * from './admin.service';
export * from './application.service';
export * from './incidents.service';

import { createAdminService } from './admin.service';
import { createApplicationService } from './application.service';
import { createIncidentsService } from './incidents.service';

export interface IncidentsServiceConfig {
  axios: AxiosInstance;
  basePath?: string;
}

export const createIncidentsServices = (config: IncidentsServiceConfig): ApiServices => {
  const { axios, basePath = '/api' } = config;
  const http = createHttpHelpers(axios);

  return {
    admin: createAdminService(http, basePath),
    application: createApplicationService(http, basePath),
    incidents: createIncidentsService(http, basePath),
  };
};

export type IncidentsServices = ReturnType<typeof createIncidentsServices>;
