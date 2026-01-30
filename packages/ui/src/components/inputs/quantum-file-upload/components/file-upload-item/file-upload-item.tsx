import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { FileDetail } from '../../../../../types/quantum-file-upload';
import { formatFileSize } from '../../../../../utils/formatters';

interface FileUploadItemProps {
  file: FileDetail;
  messages?: Record<string, string>;
}

export const FileUploadItem = ({ file, messages = {} }: FileUploadItemProps) => {
  const { progress, status, name, size } = file;

  const isError = status !== 'uploading' && status !== 'processing' && status !== 'completed';
  const isProcessing = status === 'uploading' || status === 'processing';

  const labelMessage = !isProcessing ? messages[status] || status : '';

  return (
    <Stack
      spacing={2}
      flexDirection="row"
      justifyContent="center"
      useFlexGap
      flexWrap="wrap"
      sx={{
        p: (theme) => theme.spacing(1, 2.5),
        backgroundColor: (theme) => (isError ? alpha(theme.palette.error.main, 0.08) : ''),
      }}
    >
      <Stack sx={{ flexGrow: 1, width: '70%' }} spacing={1} flexDirection="row" alignContent="center" flexWrap="wrap">
        <Stack
          sx={{ flexGrow: 1, width: '75%' }}
          spacing={1}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <InsertDriveFileIcon 
            sx={{ 
              width: 40, 
              height: 40,
              color: (theme) => isError ? theme.palette.error.main : theme.palette.primary.main
            }} 
          />
          <Stack sx={{ width: 'calc(100% - 60px)' }}>
            <Typography
              variant="subtitle2"
              sx={{
                overflow: 'hidden',
                width: '100%',
                fontWeight: 400,
                color: (theme) => (isProcessing ? theme.palette.grey[500] : theme.palette.text.primary),
              }}
            >
              {name}
            </Typography>
            {isProcessing && progress < 100 && (
              <Stack justifyContent="space-between" flexDirection="row" alignItems="center" gap={2}>
                <LinearProgress sx={{ width: '100%' }} variant="determinate" value={progress} />
                <Typography variant="subtitle2" sx={{ fontWeight: 400, color: (theme) => theme.palette.grey[500] }}>
                  {progress}%
                </Typography>
              </Stack>
            )}
            {!isProcessing && (
              <Typography
                variant="subtitle2"
                sx={{
                  color: (theme) => (isError ? theme.palette.error.main : theme.palette.success.main),
                  fontWeight: 400,
                }}
              >
                {labelMessage}
              </Typography>
            )}
          </Stack>
        </Stack>
        <Stack
          sx={{
            flexGrow: 1,
            width: '20%',
            color: (theme) => (isProcessing ? theme.palette.grey[500] : theme.palette.text.primary),
          }}
          justifyContent="center"
        >
          {formatFileSize(size)}
        </Stack>
      </Stack>
    </Stack>
  );
};
