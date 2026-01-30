'use client';

import type { UploadProps, FilesUploadType } from '../types';

import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { fData } from '../../../../utils/format-number';
import { Iconify } from '../../../data-display/iconify';
import { getFileMeta } from '../../../data-display/file-thumbnail';

// ----------------------------------------------------------------------

export type FileListPreviewProps = {
  files: FilesUploadType | File | string;
  onRemove?: UploadProps['onRemove'];
  onDownload?: (file: File) => void;
  layout?: 'stacked' | 'side-by-side';
  showPlaceholder?: boolean;
  placeholderText?: string;
};

export function FileListPreview({ 
  files = [], 
  onRemove, 
  onDownload, 
  layout = 'stacked' as const,
  showPlaceholder = false,
  placeholderText = 'File list'
}: FileListPreviewProps) {
  const theme = useTheme();
  const fileArray = Array.isArray(files) ? files : files ? [files] : [];
  const isSingleFile = fileArray.length === 1;
  const isVertical = layout === 'stacked';
  
  // For single file vertical view, don't show the container box
  if (isSingleFile && isVertical && fileArray.length > 0) {
    return (
      <Box sx={{ 
        mt: (layout as string) !== 'side-by-side' ? 2 : 0,
        width: (layout as string) === 'side-by-side' ? '50%' : '100%',
        pl: (layout as string) === 'side-by-side' ? 2 : 0
      }}>
        {fileArray.map((file) => {
          const fileMeta = getFileMeta(file);
          
          return (
            <FileItem key={fileMeta.key}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Iconify 
                    icon="solar:document-text-bold-duotone" 
                    sx={{ width: 40, height: 40, color: 'primary.main' }} 
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', mr: 2 }}>
                  <Typography 
                    variant="body2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%'
                    }}
                  >
                    {fileMeta.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {fileMeta.size ? fData(fileMeta.size) : ''}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                {onDownload && file instanceof File && (
                  <IconButton 
                    size="small" 
                    onClick={() => onDownload(file)}
                    sx={{ color: 'text.primary' }}
                  >
                    <Iconify icon="solar:download-bold" width={20} />
                  </IconButton>
                )}
                {onRemove && (
                  <IconButton 
                    size="small" 
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemove(file);
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                  </IconButton>
                )}
              </Box>
            </FileItem>
          );
        })}
      </Box>
    );
  }
  
  return (
    <Box sx={{ 
      mt: layout === 'stacked' ? 2 : 0,
      width: layout === 'side-by-side' ? '50%' : '100%',
      pl: layout === 'side-by-side' ? 2 : 0
    }}>
      <Box sx={{
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        border: `1px dashed ${alpha(theme.palette.grey[500], 0.3)}`,
        borderRadius: 1,
        backgroundColor: 'transparent',
        p: fileArray.length > 0 ? 2 : 0
      }}>
        {fileArray.length === 0 && showPlaceholder && (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Typography variant="body2" color="text.secondary">
              {placeholderText}
            </Typography>
          </Box>
        )}
        
        {fileArray.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {fileArray.map((file) => {
              const fileMeta = getFileMeta(file);
              
              return (
                <FileItem key={fileMeta.key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Iconify 
                        icon="solar:document-text-bold-duotone" 
                        sx={{ width: 40, height: 40, color: 'primary.main' }} 
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', mr: 2 }}>
                      <Typography 
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          width: '100%'
                        }}
                      >
                        {fileMeta.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {fileMeta.size ? fData(fileMeta.size) : ''}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                    {onDownload && file instanceof File && (
                      <IconButton 
                        size="small" 
                        onClick={() => onDownload(file)}
                        sx={{ color: 'text.primary' }}
                      >
                        <Iconify icon="solar:download-bold" width={20} />
                      </IconButton>
                    )}
                    {onRemove && (
                      <IconButton 
                        size="small" 
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onRemove(file);
                        }}
                        sx={{ color: 'error.main' }}
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                      </IconButton>
                    )}
                  </Box>
                </FileItem>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

const FileItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
  },
}));
