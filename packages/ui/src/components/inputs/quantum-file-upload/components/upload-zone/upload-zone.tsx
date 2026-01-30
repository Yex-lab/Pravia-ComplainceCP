import { useDropzone } from 'react-dropzone';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface UploadZoneProps {
  onFilesSelected: (files: FileList) => void;
  disabled?: boolean;
  accept?: Record<string, string[]>;
  maxFiles?: number;
}

export const UploadZone = ({ onFilesSelected, disabled, accept, maxFiles }: UploadZoneProps) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    disabled,
    accept,
    maxFiles,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const dataTransfer = new DataTransfer();
        acceptedFiles.forEach((file) => dataTransfer.items.add(file));
        onFilesSelected(dataTransfer.files);
      }
    },
  });

  const hasError = isDragReject;

  return (
    <Box
      {...getRootProps()}
      sx={{
        p: 5,
        outline: 'none',
        borderRadius: 2,
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        border: (theme) => `2px dashed ${alpha(theme.palette.grey[500], 0.3)}`,
        transition: (theme) => theme.transitions.create(['opacity', 'border-color', 'background-color']),
        '&:hover': {
          opacity: 0.72,
          borderColor: (theme) => theme.palette.primary.main,
        },
        ...(isDragActive && {
          opacity: 0.72,
          borderColor: (theme) => theme.palette.primary.main,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        }),
        ...(disabled && {
          opacity: 0.48,
          pointerEvents: 'none',
        }),
        ...(hasError && {
          color: 'error.main',
          borderColor: 'error.main',
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
        }),
      }}
    >
      <input {...getInputProps()} />
      
      <Stack spacing={2} alignItems="center" justifyContent="center">
        <CloudUploadIcon sx={{ width: 80, height: 80, color: 'text.secondary' }} />
        <Stack spacing={1} sx={{ textAlign: 'center' }}>
          <Typography variant="h6">
            {isDragActive ? 'Drop files here' : 'Drop or Select files'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Drop files here or click
            <Box
              component="span"
              sx={{
                mx: 0.5,
                color: 'primary.main',
                textDecoration: 'underline',
              }}
            >
              browse
            </Box>
            to upload
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};
