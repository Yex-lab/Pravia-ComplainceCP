import type { ApiServices } from '../../../core/api-services.interface';
import type { ApiSlices } from '../../../core/api-slices.interface';

export * from './admin.slice';
export * from './application.slice';
export * from './incidents.slice';

import { createAdminsSlice } from './admin.slice';
import { createApplicationsSlice } from './application.slice';
import { createIncidentsSlice } from './incidents.slice';

export const createIncidentsSlices = (services: ApiServices): ApiSlices => ({
  admin: createAdminsSlice(services.admin),
  application: createApplicationsSlice(services.application),
  incidents: createIncidentsSlice(services.incidents),
});

export type IncidentsSlices = ReturnType<typeof createIncidentsSlices>;
