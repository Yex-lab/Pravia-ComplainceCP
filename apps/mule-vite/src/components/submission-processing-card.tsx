import { Box, Typography, LinearProgress } from '@mui/material';

const ORDER = [
  'Extraction process initiated',
  'Validating document organization',
  'Extracting the document',
  'Analyzing the document',
  'Saving information',
  'Extraction completed',
];

function statusToProgress(status?: string | null) {
  if (!status) return null;
  const idx = ORDER.findIndex((s) => s.toLowerCase() === status.trim().toLowerCase());
  if (idx === -1) return null;
  return Math.round(((idx + 1) / ORDER.length) * 100);
}

export function SubmissionProcessingCard({
  fileName,
  status,
  isLoading,
}: {
  fileName: string;
  status: string | null | undefined;
  isLoading: boolean;
}) {
  const progress = statusToProgress(status);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1">{fileName}</Typography>

      <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
        {isLoading ? '...' : (status ?? '')}
      </Typography>

      <Box sx={{ mt: 2 }}>
        {progress === null ? (
          <LinearProgress />
        ) : (
          <LinearProgress variant="determinate" value={progress} />
        )}

        {progress !== null && (
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.75 }}>
            {progress}%
          </Typography>
        )}
      </Box>
    </Box>
  );
}
