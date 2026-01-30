import { ICONS, Iconify } from '@asyml8/ui';

import { Box, Card, IconButton } from '@mui/material';

import { useSubmissionStatus } from 'src/hooks/use-submission-status';

import { useSubmissionProcessingStore } from 'src/store/submission-processing.store';

import { SubmissionProcessingCard } from 'src/components/submission-processing-card';

export function SubmissionProcessingWidget() {
  const { activeSubmissionId, fileName, isOpen, isVisible, toggleOpen, hide, show } =
    useSubmissionProcessingStore();

  const statusQuery = useSubmissionStatus(activeSubmissionId ?? undefined);
  const status = statusQuery.data?.documentStatus ?? null;
  console.log('STATUS QUERY =>', {
    status: statusQuery.status,
    isFetching: statusQuery.isFetching,
    isError: statusQuery.isError,
    error: statusQuery.error,
    data: statusQuery.data,
  });

  if (!activeSubmissionId) return null;

  if (!isVisible) {
    return (
      <Box sx={{ position: 'fixed', top: 112, right: 16, zIndex: 2000 }}>
        <IconButton onClick={show}>
          <Iconify icon={ICONS.CHEVRON_DOWN} />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'fixed', top: 112, right: 16, zIndex: 2000, width: 380 }}>
      <Card sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <IconButton size="small" onClick={toggleOpen} title={isOpen ? 'Minimize' : 'Expand'}>
            <Iconify
              icon={ICONS.CHEVRON_DOWN}
              sx={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </IconButton>

          <IconButton size="small" onClick={hide} title="Hide">
            <Iconify icon={ICONS.CLOSE} />
          </IconButton>
        </Box>

        {isOpen && (
          <SubmissionProcessingCard
            fileName={fileName ?? 'document.pdf'}
            status={status}
            isLoading={statusQuery.isLoading}
          />
        )}
      </Card>
    </Box>
  );
}
