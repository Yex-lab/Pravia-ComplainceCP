import type { createHttpHelpers } from '../../../core/http-helpers';
import type {
  SubmissionDto,
  SubmissionStatusResponseDto,
  CreateSubmissionDto,
  UpdateSubmissionDto,
} from '../types';

export const createSubmissionsService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    getSubmissionsByAccountByAccountId: (accountId: string): Promise<SubmissionDto> =>
      http.get(`${basePath}/api/submissions/by-account/${accountId}`),

    getSubmissionsByContactByContactId: (contactId: string): Promise<SubmissionDto> =>
      http.get(`${basePath}/api/submissions/by-contact/${contactId}`),

    getSubmissionsByIdStatus: (id: string): Promise<SubmissionStatusResponseDto> =>
      http.get(`${basePath}/api/submissions/${id}/status`),

    getSubmissions: (): Promise<SubmissionDto[]> => http.get(`${basePath}/api/submissions`),

    createSubmissions: (data: CreateSubmissionDto): Promise<SubmissionDto> =>
      http.post(`${basePath}/api/submissions`, data),

    getSubmissionsWithContact: (): Promise<SubmissionDto[]> =>
      http.get(`${basePath}/api/submissions/with-contact`),

    getSubmissionsWithAllRelations: (): Promise<SubmissionDto[]> =>
      http.get(`${basePath}/api/submissions/with-all-relations`),

    getSubmissionsPortal: (): Promise<SubmissionDto[]> =>
      http.get(`${basePath}/api/submissions/portal`),

    createSubmissionsPortal: (data: CreateSubmissionDto): Promise<SubmissionDto> =>
      http.post(`${basePath}/api/submissions/portal`, data),

    getSubmissionsById: (id: string): Promise<SubmissionDto> =>
      http.get(`${basePath}/api/submissions/${id}`),

    updateSubmissionsById: (id: string, data: UpdateSubmissionDto): Promise<SubmissionDto> =>
      http.put(`${basePath}/api/submissions/${id}`, data),

    deleteSubmissionsById: (id: string): Promise<void> =>
      http.delete(`${basePath}/api/submissions/${id}`),

    createSubmissionsWithFile: (data: any): Promise<SubmissionDto> =>
      http.post(`${basePath}/api/submissions/with-file`, data),

    createSubmissionsPortalWithFile: (data: any): Promise<SubmissionDto> =>
      http.post(`${basePath}/api/submissions/portal/with-file`, data),

    createSubmissionsPortalSupportingFiles: (data: any): Promise<SubmissionDto> =>
      http.post(`${basePath}/api/submissions/portal/supporting-files`, data),

    createSubmissionsByIdUpload: (id: string, data: any): Promise<object> =>
      http.post(`${basePath}/api/submissions/${id}/upload`, data),
  };
};
