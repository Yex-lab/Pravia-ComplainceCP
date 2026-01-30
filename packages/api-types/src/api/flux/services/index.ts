import type { AxiosInstance } from 'axios';

import type { ApiServices } from '../../../core/api-services.interface';
import { createHttpHelpers } from '../../../core/http-helpers';

export * from './accounts.service';
export * from './admin.service';
export * from './application.service';
export * from './attachments.service';
export * from './contacts.service';
export * from './designees.service';
export * from './document-types.service';
export * from './document-urls.service';
export * from './organization-members.service';
export * from './public.service';
export * from './submissions.service';
export * from './test-only-cleanup.service';

import { createAccountsService } from './accounts.service';
import { createAdminService } from './admin.service';
import { createApplicationService } from './application.service';
import { createAttachmentsService } from './attachments.service';
import { createContactsService } from './contacts.service';
import { createDesigneesService } from './designees.service';
import { createDocumentTypesService } from './document-types.service';
import { createDocumentUrlsService } from './document-urls.service';
import { createOrganizationMembersService } from './organization-members.service';
import { createPublicService } from './public.service';
import { createSubmissionsService } from './submissions.service';
import { createTestOnlyCleanupService } from './test-only-cleanup.service';

export interface FluxServiceConfig {
  axios: AxiosInstance;
  basePath?: string;
}

export const createFluxServices = (config: FluxServiceConfig): ApiServices => {
  const { axios, basePath = '/api' } = config;
  const http = createHttpHelpers(axios);

  return {
    accounts: createAccountsService(http, basePath),
    admin: createAdminService(http, basePath),
    application: createApplicationService(http, basePath),
    attachments: createAttachmentsService(http, basePath),
    contacts: createContactsService(http, basePath),
    designees: createDesigneesService(http, basePath),
    documentTypes: createDocumentTypesService(http, basePath),
    documentUrls: createDocumentUrlsService(http, basePath),
    organizationMembers: createOrganizationMembersService(http, basePath),
    public: createPublicService(http, basePath),
    submissions: createSubmissionsService(http, basePath),
    testOnlyCleanup: createTestOnlyCleanupService(http, basePath),
  };
};

export type FluxServices = ReturnType<typeof createFluxServices>;
