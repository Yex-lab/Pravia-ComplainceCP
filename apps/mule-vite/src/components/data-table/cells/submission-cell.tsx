import { ICONS, Iconify } from '@asyml8/ui';

import { Box, Tooltip, Typography } from '@mui/material';

interface SubmissionCellProps {
  title: string;
  documentType?: string;
  onClick?: () => void;
}

export function SubmissionCell({ title, documentType, onClick }: SubmissionCellProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.main',
        }}
      >
        <Iconify icon={ICONS.DOCUMENT_TEXT_DUOTONE} width={40} />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="subtitle2"
          onClick={onClick}
          sx={{
            color: 'text.primary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: onClick ? 'pointer' : 'default',
            '&:hover': onClick ? { textDecoration: 'underline' } : {},
          }}
        >
          {title}
        </Typography>
        {documentType && (
          <Tooltip title={documentType} placement="bottom-start" enterDelay={500} leaveDelay={0}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
              }}
            >
              {documentType}
            </Typography>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
