import type { IconButtonProps } from '@mui/material/IconButton';

import { memo } from 'react';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import { AnimateBorder } from '../../utils/animations/interactive';

// ----------------------------------------------------------------------

export type AccountButtonProps = IconButtonProps & {
  photoURL?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
};

function getInitials(displayName?: string, firstName?: string, lastName?: string): string {
  if (firstName && lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
  if (firstName) {
    return firstName.charAt(0).toUpperCase();
  }
  if (displayName) {
    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return '';
}

const AvatarContent = memo(({ photoURL, firstName, lastName, displayName }: Pick<AccountButtonProps, 'photoURL' | 'firstName' | 'lastName' | 'displayName'>) => {
  const initials = getInitials(displayName, firstName, lastName);
  
  return (
    <Avatar
      src={photoURL}
      alt={firstName && lastName ? `${firstName} ${lastName}` : displayName || 'User'}
      sx={{
        width: 1,
        height: 1,
        fontSize: '14px',
        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: (theme) => theme.palette.primary.darker,
        filter: 'brightness(1.15)',
        fontWeight: 'bold',
      }}
    >
      {initials}
    </Avatar>
  );
});

AvatarContent.displayName = 'AvatarContent';

export function AccountButton({ photoURL, firstName, lastName, displayName, sx, ...other }: AccountButtonProps) {
  return (
    <IconButton
      aria-label="Account button"
      sx={[{ p: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <AnimateBorder
        sx={{ p: '3px', borderRadius: '50%', width: 40, height: 40 }}
        slotProps={{
          primaryBorder: { size: 60, width: '1px', sx: { color: 'primary.dark', opacity: 0.9 } },
          secondaryBorder: { sx: { color: 'primary.dark', opacity: 0.7 } },
        }}
      >
        <AvatarContent 
          photoURL={photoURL}
          firstName={firstName}
          lastName={lastName}
          displayName={displayName}
        />
      </AnimateBorder>
    </IconButton>
  );
}
