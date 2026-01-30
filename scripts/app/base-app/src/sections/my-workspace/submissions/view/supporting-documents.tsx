'use client';

import { ICONS, Upload, Iconify } from '@asyml8/ui';

import { Box, Stack, Switch, Typography, IconButton, FormControlLabel } from '@mui/material';

type Props = {
  hasSupportingDocs: boolean;
  supportingFiles: File[];
  maxFileSize: number;
  onToggle: (checked: boolean) => void;
  onDrop: (files: File[]) => void;
  onRemove: (index: number) => void;
};

export function SupportingDocuments({
  hasSupportingDocs,
  supportingFiles,
  maxFileSize,
  onToggle,
  onDrop,
  onRemove,
}: Props) {
  return (
    <Box sx={{ mt: 4 }}>
      <FormControlLabel
        control={
          <Switch checked={hasSupportingDocs} onChange={(e) => onToggle(e.target.checked)} />
        }
        label={<Typography variant="subtitle1">Supporting documents</Typography>}
      />

      {hasSupportingDocs && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Upload any additional supporting documents (PDF only).
          </Typography>

          <Upload
            multiple
            value={supportingFiles}
            previewMode="list"
            previewLayout="stacked"
            minHeight={140}
            maxHeight={220}
            onDrop={onDrop}
            accept={{
              'application/pdf': ['.pdf'],
            }}
            maxSize={maxFileSize}
            placeholder={
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Iconify
                  icon={ICONS.CLOUD_UPLOAD_SOLAR}
                  sx={{ width: 40, height: 40, mb: 1.5, color: 'text.disabled' }}
                />
                <Typography variant="subtitle2">Upload supporting documents</Typography>
                <Typography variant="caption" color="text.secondary">
                  PDF • Max {Math.round(maxFileSize / (1024 * 1024))} MB each
                </Typography>
              </Box>
            }
          />

          {supportingFiles.length > 0 && (
            <Stack spacing={1} sx={{ mt: 2 }}>
              {supportingFiles.map((file, index) => (
                <Box
                  key={`${file.name}-${index}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    bgcolor: 'background.neutral',
                  }}
                >
                  <Typography variant="body2" noWrap>
                    {file.name}
                  </Typography>

                  <IconButton size="small" color="error" onClick={() => onRemove(index)}>
                    <Iconify icon={ICONS.TRASH_BIN} />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
}
