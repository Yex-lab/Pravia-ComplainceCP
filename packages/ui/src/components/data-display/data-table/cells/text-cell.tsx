import { Typography } from '@mui/material';
import type { TextCellProps } from '../types';


export function TextCell({
  value,
  fallback = '-',
  variant = 'body2',
  color = 'textPrimary',
  noWrap = false
}: TextCellProps) {
  return (
    <Typography
      variant={variant}
      color={color}
      noWrap={noWrap}
      sx={noWrap ? {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      } : undefined}
    >
      {value || fallback}
    </Typography>
  );
}
