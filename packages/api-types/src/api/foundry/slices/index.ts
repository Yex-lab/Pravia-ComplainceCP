import type { ApiServices } from '../../../core/api-services.interface';
import type { ApiSlices } from '../../../core/api-slices.interface';

export * from './application.slice';
export * from './authentication.slice';
export * from './roles.slice';
export * from './user-management.slice';

import { createApplicationsSlice } from './application.slice';
import { createAuthenticationsSlice } from './authentication.slice';
import { createRolesSlice } from './roles.slice';
import { createUserManagementsSlice } from './user-management.slice';

export const createFoundrySlices = (services: ApiServices): ApiSlices => ({
  application: createApplicationsSlice(services.application),
  authentication: createAuthenticationsSlice(services.authentication),
  roles: createRolesSlice(services.roles),
  userManagement: createUserManagementsSlice(services.userManagement),
});

export type FoundrySlices = ReturnType<typeof createFoundrySlices>;
