import { Box, IconButton, LinearProgress, Stack, Typography, alpha, CircularProgress } from '@mui/material';
import { Iconify } from '../../../data-display/iconify';
import type { FileCardProps } from '../../../../types/quantum-file-upload';

const getFileIcon = (type: string): string => {
  if (type.startsWith('image/')) return 'solar:gallery-linear';
  if (type.includes('pdf')) return 'solar:document-text-linear';
  if (type.includes('video')) return 'solar:videocamera-linear';
  if (type.includes('audio')) return 'solar:music-note-linear';
  if (type.includes('zip') || type.includes('rar')) return 'solar:archive-linear';
  return 'solar:file-linear';
};

const getFileColor = (type: string): string => {
  if (type.startsWith('image/')) return '#2196F3';
  if (type.includes('pdf')) return '#F44336';
  if (type.includes('video')) return '#9C27B0';
  if (type.includes('audio')) return '#FF9800';
  if (type.includes('zip') || type.includes('rar')) return '#795548';
  return '#607D8B';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const FileCard = ({
  file,
  styleConfig = {},
  onDownload,
  onDelete,
  onPreview,
  showMetadata = true,
}: FileCardProps) => {
  const {
    variant = 'card',
    size = 'medium',
    colors = {},
    spacing = {},
    icon = {},
    progress = {},
    actions = {},
  } = styleConfig;

  const iconSize = icon.size || (size === 'small' ? 44 : size === 'large' ? 68 : 52);
  const padding = spacing.padding || (size === 'small' ? '8px 8px' : size === 'large' ? '12px 12px' : '10px 10px');
  const borderRadius = spacing.borderRadius || '12px';
  const gap = spacing.gap || '8px';

  const isFailed = file.status === 'failed';
  
  // Use secondary text color for icon unless colorByType is explicitly enabled or failed
  const iconColor = isFailed 
    ? '#F44336' 
    : icon.colorByType === true 
      ? getFileColor(file.type)
      : 'text.secondary';
  
  // Background color - transparent for icon
  const iconBgColor = 'transparent';
  
  const showProgress = progress.show !== false && (file.status === 'uploading' || file.status === 'processing');
  const showActions = actions.show !== false;

  // Failed state colors
  const backgroundColor = isFailed 
    ? colors.background || alpha('#F44336', 0.08)
    : colors.background || 'action.hover';
  
  const borderColor = isFailed
    ? colors.border || alpha('#F44336', 0.5)
    : colors.border || 'divider';
  
  const hoverBackgroundColor = isFailed
    ? colors.hoverBackground || alpha('#F44336', 0.12)
    : colors.hoverBackground || 'action.selected';

  const progressBarColor = isFailed
    ? colors.errorColor || '#F44336'
    : colors.progressBar || 'primary.main';

  return (
    <Box
      sx={{
        position: 'relative',
        p: padding,
        borderRadius,
        border: 1,
        borderColor,
        bgcolor: backgroundColor,
        transition: 'all 0.2s',
        overflow: 'hidden',
        '&:hover': {
          bgcolor: hoverBackgroundColor,
          borderColor: isFailed ? alpha('#F44336', 0.7) : 'action.disabled',
        },
      }}
    >
      {/* Close/Cancel button - top right */}
      {(file.status === 'uploading' || file.status === 'failed') && (
        <IconButton
          size="small"
          onClick={() => onDelete?.(file)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: file.status === 'failed' ? 'error.main' : undefined,
          }}
        >
          <Iconify icon={"solar:close-circle-linear" as any} width={20} />
        </IconButton>
      )}

      <Stack spacing={1}>
        {/* Top row: Icon, File Info, Status Icon */}
        <Stack direction="row" spacing={gap} alignItems="center">
          {/* File Icon */}
          <Box
            sx={{
              width: iconSize,
              height: iconSize,
              borderRadius: '8px',
              bgcolor: iconBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              alignSelf: 'center',
            }}
          >
            <Iconify 
              icon={getFileIcon(file.type) as any} 
              width={iconSize * 0.6} 
              sx={{ color: iconColor }}
            />
          </Box>

          {/* File Info */}
          <Stack spacing={0.5} flex={1} minWidth={0} justifyContent="center">
            <Typography
              variant={size === 'small' ? 'body2' : 'body1'}
              fontWeight={500}
              color={colors.primaryText || 'text.primary'}
              noWrap
            >
              {file.name}
            </Typography>
            {showMetadata && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" color={colors.secondaryText || 'text.secondary'}>
                  {formatFileSize(file.size)}
                  {file.status === 'uploading' && progress.showPercentage !== false && ` • ${file.progress}%`}
                </Typography>
                {file.statusMessage && (
                  <>
                    <Typography variant="caption" color={colors.secondaryText || 'text.secondary'}>
                      •
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color={
                        file.status === 'failed' ? 'error.main' : 
                        file.status === 'completed' ? 'success.main' : 
                        'text.secondary'
                      }
                    >
                      {file.statusMessage}
                    </Typography>
                  </>
                )}
              </Stack>
            )}
          </Stack>

          {/* Status icons for completed state only */}
          {file.status === 'completed' && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              {!onDownload && (
                <Iconify icon={"solar:check-circle-linear" as any} width={24} sx={{ color: 'success.main' }} />
              )}
              {onDownload && (
                <IconButton size="small" onClick={() => onDownload(file)}>
                  <Iconify icon={"solar:download-linear" as any} width={24} />
                </IconButton>
              )}
            </Stack>
          )}
        </Stack>

        {/* Progress Bar - Full width below */}
        {showProgress && (
          <Box
            sx={{
              width: `calc(100% - ${iconSize + 8}px)`,
              height: progress.height || 8,
              bgcolor: alpha('#fff', 0.05),
              borderRadius: 1,
              overflow: 'hidden',
              ml: `${iconSize + 8}px`,
            }}
          >
            <Box
              sx={{
                width: `${file.progress}%`,
                height: '100%',
                borderRadius: 1,
                background: (theme) => `repeating-linear-gradient(
                  45deg,
                  ${theme.palette.primary.main},
                  ${theme.palette.primary.main} 10px,
                  ${alpha(theme.palette.primary.main, 0.7)} 10px,
                  ${alpha(theme.palette.primary.main, 0.7)} 20px
                )`,
                backgroundSize: '28px 28px',
                animation: 'barberPole 1s linear infinite',
                '@keyframes barberPole': {
                  '0%': { backgroundPosition: '0 0' },
                  '100%': { backgroundPosition: '28px 0' },
                },
              }}
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
};
