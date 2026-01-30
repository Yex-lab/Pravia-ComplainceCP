import type { FluxTypes } from '@asyml8/api-types';

import { fluxServices } from 'src/api/flux.api';

type CreateSubmissionDto = FluxTypes.CreateSubmissionDto;

/**
 * Custom submission service methods that handle FormData uploads.
 * For standard CRUD operations, use fluxServices.submissions directly.
 */
export const submissionService = {
  /**
   * Create submission with file upload
   */
  async createWithFile(submissionData: CreateSubmissionDto, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (submissionData.name) formData.append('name', submissionData.name);
    if (submissionData.accountId) formData.append('accountId', submissionData.accountId);
    if (submissionData.primaryContactId)
      formData.append('primaryContactId', submissionData.primaryContactId);
    if (submissionData.documentTypeId)
      formData.append('documentTypeId', submissionData.documentTypeId);

    // API now returns a proper SubmissionDto
    const response = await fluxServices.submissions.createSubmissionsWithFile(formData as any);
    return response;
  },

  /**
   * Create submission with file from logged-in user's contact
   */
  async createWithFileFromLoggedUser(args: {
    title: string;
    documentTypeId: string;
    file: File;
    loggedInContact: FluxTypes.ContactResponseDto;
  }): Promise<any> {
    const contact = args.loggedInContact;
    if (!contact?.id) throw new Error('Contact not found');

    const accountId = contact.organizationId;
    if (!accountId) throw new Error('Contact has no organization/state entity');

    const dto: CreateSubmissionDto = {
      name: args.title.trim(),
      accountId,
      primaryContactId: contact.id,
      documentTypeId: args.documentTypeId,
    };

    return this.createWithFile(dto, args.file);
  },

  /**
   * Upload supporting files for a submission
   */
  async uploadSupportingFiles(params: { submissionId: string; files: File[] }): Promise<void> {
    const { submissionId, files } = params;

    const formData = new FormData();
    formData.append('submissionId', submissionId);

    for (const file of files) formData.append('files', file);

    await fluxServices.submissions.createSubmissionsPortalSupportingFiles(formData as any);
  },
};
