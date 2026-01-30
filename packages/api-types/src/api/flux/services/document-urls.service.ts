import type { createHttpHelpers } from '../../../core/http-helpers';
import type { DocumentUrlDto } from '../types';

export const createDocumentUrlsService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    getDocumentUrlsSubmissionBySubmissionId: (submissionId: string): Promise<DocumentUrlDto> =>
      http.get(`${basePath}/api/document-urls/submission/${submissionId}`),
  };
};
