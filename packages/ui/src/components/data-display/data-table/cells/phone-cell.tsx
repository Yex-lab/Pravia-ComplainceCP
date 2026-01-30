import { ICONS, Iconify, TextCell, formatPhoneNumber } from '@asyml8/ui';

import { Box, Typography } from '@mui/material';

interface PhoneCellProps {
  value?: string | null;
  extension?: string | null;
  type?: 'phone' | 'mobile';
}

export function PhoneCell({ value, extension, type = 'phone' }: PhoneCellProps) {
  const icon = type === 'mobile' ? ICONS.SMARTPHONE : ICONS.PHONE;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            position: 'relative',
            width: 24,
            height: 24,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: 'text.secondary',
              opacity: 0.15,
            }}
          />
          <Iconify
            icon={icon}
            width={16}
            sx={{
              color: 'text.secondary',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" noWrap sx={{ fontWeight: 600 }}>
          {formatPhoneNumber(value)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 4 }}>
        <Typography variant="caption" color="text.disabled">
          ext.
        </Typography>
        <Typography variant="caption" color="text.primary">
          {extension || '-'}
        </Typography>
      </Box>
    </Box>
  );
}
