import type { createHttpHelpers } from '../../../core/http-helpers';
import type { IncidentDto, CreateIncidentDto, UpdateIncidentDto } from '../types';

export const createIncidentsService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    getIncidentsByAccountByAccountId: (accountId: string): Promise<IncidentDto> =>
      http.get(`${basePath}/api/incidents/by-account/${accountId}`),

    getIncidentsByContactByContactId: (contactId: string): Promise<IncidentDto> =>
      http.get(`${basePath}/api/incidents/by-contact/${contactId}`),

    getIncidentsWithAllRelations: (): Promise<IncidentDto[]> =>
      http.get(`${basePath}/api/incidents/with-all-relations`),

    getIncidents: (): Promise<IncidentDto[]> => http.get(`${basePath}/api/incidents`),

    createIncidents: (data: CreateIncidentDto): Promise<IncidentDto> =>
      http.post(`${basePath}/api/incidents`, data),

    getIncidentsById: (id: string): Promise<IncidentDto> =>
      http.get(`${basePath}/api/incidents/${id}`),

    updateIncidentsById: (id: string, data: UpdateIncidentDto): Promise<IncidentDto> =>
      http.put(`${basePath}/api/incidents/${id}`, data),

    deleteIncidentsById: (id: string): Promise<void> =>
      http.delete(`${basePath}/api/incidents/${id}`),
  };
};
