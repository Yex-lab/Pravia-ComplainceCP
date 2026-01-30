import { Typography } from '@mui/material';
import type { DateCellProps } from '../types';


export function DateCell({ 
  value, 
  format = 'date',
  fallback = 'Never',
  variant = 'body2'
}: DateCellProps) {
  if (!value) {
    return (
      <Typography variant={variant} color="textSecondary">
        {fallback}
      </Typography>
    );
  }

  const date = new Date(value);
  let formattedDate: string;

  switch (format) {
    case 'datetime':
      formattedDate = date.toLocaleString();
      break;
    case 'time':
      formattedDate = date.toLocaleTimeString();
      break;
    case 'relative':
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) formattedDate = 'Today';
      else if (diffDays === 1) formattedDate = 'Yesterday';
      else if (diffDays < 7) formattedDate = `${diffDays} days ago`;
      else formattedDate = date.toLocaleDateString();
      break;
    default:
      formattedDate = date.toLocaleDateString();
  }

  return (
    <Typography variant={variant} color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
      {formattedDate}
    </Typography>
  );
}
