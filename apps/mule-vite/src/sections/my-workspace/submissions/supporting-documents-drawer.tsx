import { ICONS, Iconify, FeatureDrawer } from '@asyml8/ui';

import {
  Box,
  Chip,
  Stack,
  Button,
  Tooltip,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';

import { useTranslation } from 'src/hooks/use-translation';

interface SupportingDocument {
  id: string;
  name: string;
  size?: number;
  uploadedAt?: string;
  url?: string;
}

interface SupportingDocumentsDrawerProps {
  open: boolean;
  onClose: () => void;
  submissionId?: string;
  submissionName?: string;
  documentType?: string;
  documents?: SupportingDocument[];
  loading?: boolean;
}

export function SupportingDocumentsDrawer({
  open,
  onClose,
  submissionName,
  documentType,
  documents = [],
  loading = false,
}: SupportingDocumentsDrawerProps) {
  const { t } = useTranslation();

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };
  const DATA_API = (import.meta.env.VITE_DATA_API_URL ?? '').replace(/\/+$/, '');

  const buildUrl = (u: string) => {
    if (!u) return '';
    if (/^https?:\/\//i.test(u)) return u;
    return `${DATA_API}/${u.replace(/^\/+/, '')}`;
  };

  return (
    <FeatureDrawer
      open={open}
      onClose={onClose}
      title={t('submissions.drawer.title')}
      subtitle={t('submissions.drawer.subtitle')}
      icon={ICONS.DOCUMENT_TEXT_DUOTONE}
      iconSize={48}
      width={480}
      footer={
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={onClose}
            startIcon={<Iconify icon={ICONS.CLOSE_CIRCLE} />}
          >
            {t('actions.cancel')}
          </Button>
        </Stack>
      }
    >
      {/* Submission Info Section */}
      {(submissionName || documentType) && (
        <Box sx={{ mb: 3, pb: 3, borderBottom: (theme) => `1px dashed ${theme.palette.divider}` }}>
          <Stack spacing={1.5}>
            {submissionName && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Name
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {submissionName}
                </Typography>
              </Box>
            )}
            {documentType && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Type
                </Typography>
                <Chip
                  label={documentType}
                  size="small"
                  color="default"
                  sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    py: 0.5,
                    '& .MuiChip-label': {
                      whiteSpace: 'normal',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      px: 1,
                    },
                  }}
                />
              </Box>
            )}
          </Stack>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading documents...
          </Typography>
        </Box>
      ) : documents.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Iconify
            icon={ICONS.DOCUMENT_TEXT}
            sx={{ width: 64, height: 64, mb: 2, color: 'text.disabled' }}
          />
          <Typography variant="body2" color="text.secondary">
            No supporting documents available
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {documents.map((doc) => (
            <Box
              key={doc.id}
              sx={{
                p: 1.5,
                borderRadius: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Iconify icon={ICONS.FILE} width={32} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap>
                    {doc.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatFileSize(doc.size)} • {formatDate(doc.uploadedAt)}
                  </Typography>
                </Box>
                {doc.url && (
                  <Tooltip title="Download">
                    <IconButton
                      size="small"
                      onClick={() => {
                        const url = buildUrl(doc.url!);
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <Iconify icon={ICONS.DOWNLOAD} />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </FeatureDrawer>
  );
}
