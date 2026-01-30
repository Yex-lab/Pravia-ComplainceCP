import { Label } from '../../label';
import type { LabelColor, LabelVariant } from '../../label/types';
import type { ChipCellProps } from '../types';


export function ChipCell({ 
  value, 
  color = 'default', 
  variant = 'soft',
  fallback = 'Unknown'
}: ChipCellProps) {
  return (
    <Label 
      color={color}
      variant={variant}
      sx={{
        fontWeight: 800,
        fontSize: '0.6875rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
    >
      {value || fallback}
    </Label>
  );
}
