import React, { useState } from 'react';
import { IconButton, MenuItem, Popover } from '@mui/material';
import { Iconify } from '../../iconify';
import type { IconifyName } from '../../iconify/register-icons';
import type { ActionItem, ActionsCellProps } from '../types';



export function ActionsCell({ actions, moreIcon }: ActionsCellProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: ActionItem) => {
    action.onClick();
    handleClose();
  };

  return (
    <>
      <IconButton 
        onClick={handleClick} 
        size="small"
        aria-label="More actions"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {moreIcon ? <Iconify icon={moreIcon as IconifyName} /> : '⋮'}
      </IconButton>
      
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.id}
            onClick={() => handleActionClick(action)}
            disabled={action.disabled}
            sx={{ 
              color: action.color === 'error' ? 'error.main' : 'inherit',
              minWidth: 120,
            }}
          >
            {action.icon && (
              <span style={{ marginRight: 8, display: 'flex', alignItems: 'center' }}>
                {typeof action.icon === 'string' ? <Iconify icon={action.icon as IconifyName} /> : action.icon}
              </span>
            )}
            {action.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}