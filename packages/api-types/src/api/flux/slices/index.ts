import type { ApiServices } from '../../../core/api-services.interface';
import type { ApiSlices } from '../../../core/api-slices.interface';

export * from './accounts.slice';
export * from './admin.slice';
export * from './application.slice';
export * from './attachments.slice';
export * from './contacts.slice';
export * from './designees.slice';
export * from './document-types.slice';
export * from './document-urls.slice';
export * from './organization-members.slice';
export * from './public.slice';
export * from './submissions.slice';

import { createAccountsSlice } from './accounts.slice';
import { createAdminsSlice } from './admin.slice';
import { createApplicationsSlice } from './application.slice';
import { createAttachmentsSlice } from './attachments.slice';
import { createContactsSlice } from './contacts.slice';
import { createDesigneesSlice } from './designees.slice';
import { createDocumentTypesSlice } from './document-types.slice';
import { createDocumentUrlsSlice } from './document-urls.slice';
import { createOrganizationMembersSlice } from './organization-members.slice';
import { createPublicsSlice } from './public.slice';
import { createSubmissionsSlice } from './submissions.slice';

export const createFluxSlices = (services: ApiServices): ApiSlices => ({
  accounts: createAccountsSlice(services.accounts),
  admin: createAdminsSlice(services.admin),
  application: createApplicationsSlice(services.application),
  attachments: createAttachmentsSlice(services.attachments),
  contacts: createContactsSlice(services.contacts),
  designees: createDesigneesSlice(services.designees),
  documentTypes: createDocumentTypesSlice(services.documentTypes),
  documentUrls: createDocumentUrlsSlice(services.documentUrls),
  organizationMembers: createOrganizationMembersSlice(services.organizationMembers),
  public: createPublicsSlice(services.public),
  submissions: createSubmissionsSlice(services.submissions),
});

export type FluxSlices = ReturnType<typeof createFluxSlices>;
