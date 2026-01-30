import { Chip, CircularProgress } from '@mui/material';
import { Iconify } from '../../../data-display/iconify';

interface ContactStatusChipProps {
  email: string;
  status?: 'not_registered' | 'pending' | 'confirmed' | 'banned';
  isLoading?: boolean;
  loadingLabel?: string;
}

const chipStyles = {
  fontWeight: 800,
  fontSize: '0.6875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  '& .MuiChip-label': {
    fontWeight: 800,
    px: 1.5,
  },
} as const;

function mapContactStatus(status: ContactStatusChipProps['status']): {
  label: string;
  color: 'default' | 'warning' | 'info' | 'error';
} {
  const statusMap = {
    not_registered: { label: 'NOT REGISTERED', color: 'default' as const },
    pending: { label: 'PENDING', color: 'warning' as const },
    confirmed: { label: 'REGISTERED', color: 'info' as const },
    banned: { label: 'BANNED', color: 'error' as const },
  };

  return statusMap[status || 'not_registered'];
}

export function ContactStatusChip({ email, status, isLoading = false, loadingLabel = 'SENDING...' }: ContactStatusChipProps) {
  if (isLoading) {
    return (
      <Chip
        label={loadingLabel}
        color="default"
        size="small"
        sx={chipStyles}
        icon={<CircularProgress size={12} sx={{ color: 'inherit' }} />}
      />
    );
  }

  const finalStatus = status || 'not_registered';
  const { label, color } = mapContactStatus(finalStatus);

  return <Chip label={label} color={color} size="small" sx={chipStyles} />;
}
