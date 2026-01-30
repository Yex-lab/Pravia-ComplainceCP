import type { SubmissionStatusResponseDto } from '../../../../packages/api-types/src/api/flux/types';

import { useQuery } from '@tanstack/react-query';

import { fluxServices } from 'src/api';

export function useSubmissionStatus(submissionId?: string, statuscode?: string) {
  const statusCode = (statuscode ?? '').toLowerCase();

  return useQuery<SubmissionStatusResponseDto>({
    queryKey: ['submission-status', submissionId],
    enabled: Boolean(submissionId) && !['rejected', 'validated'].includes(statusCode),

    queryFn: () => fluxServices.submissions.getSubmissionsByIdStatus(submissionId!),

    refetchInterval: (q) => {
      const docStatus = (q.state.data?.documentStatus ?? '').toLowerCase();
      const isDocDone = docStatus.includes('completed') || docStatus.includes('error');
      const isFinal = ['rejected', 'validated'].includes(statusCode);

      return isDocDone || isFinal ? false : 2500;
    },
  });
}
