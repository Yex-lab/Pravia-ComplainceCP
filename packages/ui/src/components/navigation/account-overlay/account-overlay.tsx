'use client';

import type { IconButtonProps } from '@mui/material/IconButton';

import { varAlpha } from 'minimal-shared/utils';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';

import { Iconify } from '../../data-display/iconify';
import { AnimateBorder } from '../../utils/animations/interactive';
import { AccountButton } from '../account-button';

// ----------------------------------------------------------------------

export type MenuItem = {
  label: string;
  icon: string;
  onClick: () => void;
};

export type AccountOverlayProps = IconButtonProps & {
  user: {
    photoURL?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email?: string;
  };
  menuItems?: MenuItem[];
  onSignOut: () => void | Promise<void>;
  version?: string;
  environment?: string;
  labels?: {
    signOut?: string;
    version?: string;
  };
};

export function AccountOverlay({ 
  user, 
  menuItems = [], 
  onSignOut, 
  version = '1.0.0',
  environment,
  labels = {},
  sx, 
  ...other 
}: AccountOverlayProps) {
  const { open, anchorEl, onClose, onOpen } = usePopover();

  const { firstName, lastName, displayName, email, photoURL } = user;
  const signOutLabel = labels.signOut || 'Sign Out';
  const versionLabel = labels.version || 'Version';

  const getInitials = () => {
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
  };

  const handleSignOut = async () => {
    await onSignOut();
    onClose();
  };

  return (
    <>
      <AccountButton
        onClick={onOpen}
        photoURL={photoURL}
        firstName={firstName}
        lastName={lastName}
        displayName={displayName}
        sx={sx}
        {...other}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              width: 280,
              borderRadius: 2,
            },
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AnimateBorder
            sx={{ p: '4px', width: 80, height: 80, borderRadius: '50%' }}
            slotProps={{
              primaryBorder: { size: 100, width: '1px', sx: { color: 'primary.dark', opacity: 0.9 } },
              secondaryBorder: { sx: { color: 'primary.dark', opacity: 0.7 } },
            }}
          >
            <Avatar
              alt={firstName && lastName ? `${firstName} ${lastName}` : displayName}
              sx={{
                width: 1,
                height: 1,
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: (theme) => theme.palette.primary.darker,
                filter: 'brightness(1.15)',
                fontWeight: 'bold',
                fontSize: '28px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              {getInitials()}
            </Avatar>
          </AnimateBorder>

          <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>
            {firstName && lastName ? `${firstName} ${lastName}` : displayName}
          </Typography>

          <Tooltip title={email} arrow>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary', 
                mt: 0.5,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {email}
            </Typography>
          </Tooltip>
        </Box>

        {menuItems.length > 0 && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ p: 1.5 }}>
              {menuItems.map((item) => (
                <ButtonBase
                  key={item.label}
                  onClick={() => {
                    item.onClick();
                    onClose();
                  }}
                  sx={{
                    width: 1,
                    px: 2,
                    py: 1.5,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 2,
                    transition: (theme) => theme.transitions.create(['background-color']),
                    '&:hover': {
                      bgcolor: (theme) => varAlpha(theme.palette.grey['500Channel'], 0.08),
                    },
                  }}
                >
                  <Iconify icon={item.icon as any} width={20} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {item.label}
                  </Typography>
                </ButtonBase>
              ))}
            </Box>
          </>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1.5 }}>
          <ButtonBase
            onClick={handleSignOut}
            sx={{
              width: 1,
              px: 2,
              py: 1.5,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 2,
              transition: (theme) => theme.transitions.create(['background-color']),
              '&:hover': {
                bgcolor: (theme) => varAlpha(theme.palette.grey['500Channel'], 0.08),
              },
            }}
          >
            <Iconify icon={'solar:logout-2-outline' as any} width={20} sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {signOutLabel}
            </Typography>
          </ButtonBase>
        </Box>

        {(version || environment) && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ px: 1.5, py: 1.5, display: 'flex', justifyContent: 'center', gap: 1 }}>
              {version && (
                <Chip 
                  label={
                    <Box component="span">
                      {versionLabel}: <Box component="span" sx={{ fontWeight: 700 }}>{version}</Box>
                    </Box>
                  }
                  size="small" 
                  sx={{ fontSize: '0.7rem', height: 20, color: 'text.secondary' }}
                />
              )}
              {environment && (
                <Chip 
                  label={environment}
                  size="small" 
                  sx={{ fontSize: '0.7rem', height: 20, color: 'text.secondary', fontWeight: 700 }}
                />
              )}
            </Box>
          </>
        )}
      </Popover>
    </>
  );
}
