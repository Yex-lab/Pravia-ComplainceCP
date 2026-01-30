import type { createHttpHelpers } from '../../../core/http-helpers';
import type {
  CleanupRegisterRecordsDto,
  CleanupOrganizationDto,
  CleanupOrganizationCompleteDto,
} from '../types';

export const createTestOnlyCleanupService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    createTestOnlyCleanupRegisterRecords: (data: CleanupRegisterRecordsDto): Promise<any> =>
      http.post(`${basePath}/api/test-only/cleanup/register-records`, data),

    createTestOnlyCleanupAccountsMissingCodes: (data: CleanupOrganizationDto): Promise<any> =>
      http.post(`${basePath}/api/test-only/cleanup/accounts-missing-codes`, data),

    createTestOnlyCleanupSubmissions: (data: CleanupOrganizationDto): Promise<any> =>
      http.post(`${basePath}/api/test-only/cleanup/submissions`, data),

    createTestOnlyCleanupSupabaseUsers: (data: CleanupOrganizationDto): Promise<any> =>
      http.post(`${basePath}/api/test-only/cleanup/supabase-users`, data),

    createTestOnlyCleanupContacts: (data: CleanupOrganizationDto): Promise<any> =>
      http.post(`${basePath}/api/test-only/cleanup/contacts`, data),

    createTestOnlyCleanupDesignees: (data: CleanupOrganizationDto): Promise<any> =>
      http.post(`${basePath}/api/test-only/cleanup/designees`, data),

    createTestOnlyCleanupOrganizationDataCount: (data: CleanupOrganizationDto): Promise<any> =>
      http.post(`${basePath}/api/test-only/cleanup/organization-data-count`, data),

    createTestOnlyCleanupOrganizationComplete: (
      data: CleanupOrganizationCompleteDto,
    ): Promise<any> => http.post(`${basePath}/api/test-only/cleanup/organization-complete`, data),
  };
};
