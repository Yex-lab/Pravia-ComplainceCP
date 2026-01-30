import type { createHttpHelpers } from '../../../core/http-helpers';
import type { CreateAttachmentDto } from '../types';

export const createAttachmentsService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    getAttachments: (): Promise<object[]> => http.get(`${basePath}/api/attachments`),

    createAttachments: (data: CreateAttachmentDto): Promise<object> =>
      http.post(`${basePath}/api/attachments`, data),

    getAttachmentsBySubmissionBySubmissionId: (submissionId: string): Promise<object> =>
      http.get(`${basePath}/api/attachments/by-submission/${submissionId}`),

    getAttachmentsByParentByObjectIdByObjectType: (
      objectId: string,
      objectType: string,
    ): Promise<object> =>
      http.get(`${basePath}/api/attachments/by-parent/${objectId}/${objectType}`),

    getAttachmentsPortalByObjectIdByObjectType: (
      objectId: string,
      objectType: string,
    ): Promise<object> => http.get(`${basePath}/api/attachments/portal/${objectId}/${objectType}`),

    getAttachmentsById: (id: string): Promise<object> =>
      http.get(`${basePath}/api/attachments/${id}`),

    deleteAttachmentsById: (id: string): Promise<void> =>
      http.delete(`${basePath}/api/attachments/${id}`),

    getAttachmentsByAnnotationIdDownload: (annotationId: string): Promise<any> =>
      http.get(`${basePath}/api/attachments/${annotationId}/download`),

    createAttachmentsUploadByObjectIdByObjectType: (
      objectId: string,
      objectType: string,
      data: any,
    ): Promise<object> =>
      http.post(`${basePath}/api/attachments/upload/${objectId}/${objectType}`, data),

    createAttachmentsPortalUploadByObjectIdByObjectType: (
      objectId: string,
      objectType: string,
      data: any,
    ): Promise<object> =>
      http.post(`${basePath}/api/attachments/portal/upload/${objectId}/${objectType}`, data),

    createAttachmentsPortal: (data: CreateAttachmentDto): Promise<object> =>
      http.post(`${basePath}/api/attachments/portal`, data),
  };
};
