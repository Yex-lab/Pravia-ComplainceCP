import { fDate, Iconify, TextCell } from '@asyml8/ui';

import { Box } from '@mui/material';

interface IconCellProps {
  value?: string | null;
  icon: any;
  formatAsDate?: boolean;
}

export function IconCell({ value, icon, formatAsDate = false }: IconCellProps) {
  const displayValue = formatAsDate && value ? fDate(value) : value;

  return (
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
      <TextCell value={displayValue} color="textSecondary" noWrap />
    </Box>
  );
}
