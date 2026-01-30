import { Children } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import WarningIcon from '@mui/icons-material/Warning';
import { FileDetail, FileCardStyleConfig } from '../../../../../types/quantum-file-upload';
import { FileCard } from '../file-card';

interface UploadDrawerProps extends Omit<DrawerProps, 'onClose'> {
  files: FileDetail[];
  errorCount: number;
  onClose: () => void;
  title?: string;
  closeButtonText?: string;
  errorMessage?: string;
  messages?: Record<string, string>;
  fileCardStyle?: FileCardStyleConfig;
  onDownload?: (file: FileDetail) => void;
  onDelete?: (file: FileDetail) => void;
}

export const UploadDrawer = ({
  files,
  errorCount,
  onClose,
  open,
  title = 'Uploaded Files',
  closeButtonText = 'Close',
  errorMessage = 'Error uploading files',
  messages,
  fileCardStyle,
  onDownload,
  onDelete,
  ...other
}: UploadDrawerProps) => {
  const theme = useTheme();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: {
          [theme.breakpoints.up('xs')]: {
            width: '95%',
          },
          [theme.breakpoints.up('md')]: {
            width: 480,
          },
        },
      }}
      {...other}
    >
      {files.length > 0 && (
        <Box sx={{ height: 1, padding: 2, overflow: 'auto' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
            <Typography variant="h6">{title}</Typography>
          </Stack>
          <Box
            sx={{
              border: 1,
              borderStyle: 'dashed',
              borderColor: (theme) => alpha(theme.palette.grey[500], 0.2),
              borderRadius: 2,
              p: 2,
              bgcolor: 'background.paper',
            }}
          >
            <Stack spacing={1.5}>
              {Children.toArray(
                files.map((file) => (
                  <FileCard
                    file={file}
                    styleConfig={fileCardStyle}
                    onDownload={onDownload}
                    onDelete={onDelete}
                  />
                ))
              )}
            </Stack>
          </Box>
        </Box>
      )}

      <Stack px={2.5} mb={2}>
        {errorCount > 0 && (
          <Box
            sx={{
              py: 2,
              px: 1.5,
              my: 2,
              border: (theme) => `1px solid ${theme.palette.error.main}`,
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
              borderRadius: 1,
            }}
            flexDirection="row"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box flexDirection="row" display="flex" gap={1}>
              <WarningIcon sx={{ color: (theme) => theme.palette.error.main }} />
              <Typography variant="body2" color="error">
                {errorCount} {errorMessage}
              </Typography>
            </Box>
          </Box>
        )}
        <Button fullWidth variant="outlined" size="large" onClick={onClose}>
          {closeButtonText}
        </Button>
      </Stack>
    </Drawer>
  );
};
