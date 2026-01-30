import type { AxiosInstance } from 'axios';

import type { ApiServices } from '../../../core/api-services.interface';
import { createHttpHelpers } from '../../../core/http-helpers';

export * from './application.service';
export * from './authentication.service';
export * from './roles.service';
export * from './user-management.service';

import { createApplicationService } from './application.service';
import { createAuthenticationService } from './authentication.service';
import { createRolesService } from './roles.service';
import { createUserManagementService } from './user-management.service';

export interface FoundryServiceConfig {
  axios: AxiosInstance;
  basePath?: string;
}

export const createFoundryServices = (config: FoundryServiceConfig): ApiServices => {
  const { axios, basePath = '/api' } = config;
  const http = createHttpHelpers(axios);

  return {
    application: createApplicationService(http, basePath),
    authentication: createAuthenticationService(http, basePath),
    roles: createRolesService(http, basePath),
    userManagement: createUserManagementService(http, basePath),
  };
};

export type FoundryServices = ReturnType<typeof createFoundryServices>;
