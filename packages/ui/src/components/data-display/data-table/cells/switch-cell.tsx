import { Switch } from '@mui/material';
import type { SwitchCellProps } from '../types';


export function SwitchCell({ 
  checked, 
  onChange, 
  disabled = false,
  size = 'small',
  color = 'primary'
}: SwitchCellProps) {
  return (
    <Switch
      checked={checked}
      onChange={(event) => {
        event.stopPropagation();
        onChange(event.target.checked);
      }}
      disabled={disabled}
      size={size}
      color={color}
    />
  );
}
