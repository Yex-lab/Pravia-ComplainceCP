import type { createHttpHelpers } from '../../../core/http-helpers';
import type { DocumentTypeDto, CreateDocumentTypeDto, UpdateDocumentTypeDto } from '../types';

export const createDocumentTypesService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    getDocumentTypes: (): Promise<DocumentTypeDto[]> => http.get(`${basePath}/api/document-types`),

    createDocumentTypes: (data: CreateDocumentTypeDto): Promise<DocumentTypeDto> =>
      http.post(`${basePath}/api/document-types`, data),

    getDocumentTypesActive: (): Promise<DocumentTypeDto[]> =>
      http.get(`${basePath}/api/document-types/active`),

    getDocumentTypesPortal: (): Promise<DocumentTypeDto[]> =>
      http.get(`${basePath}/api/document-types/portal`),

    getDocumentTypesById: (id: string): Promise<DocumentTypeDto> =>
      http.get(`${basePath}/api/document-types/${id}`),

    updateDocumentTypesById: (id: string, data: UpdateDocumentTypeDto): Promise<DocumentTypeDto> =>
      http.put(`${basePath}/api/document-types/${id}`, data),

    deleteDocumentTypesById: (id: string): Promise<void> =>
      http.delete(`${basePath}/api/document-types/${id}`),
  };
};
