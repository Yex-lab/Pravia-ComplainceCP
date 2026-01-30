'use client';

import { useState } from 'react';
import { fDate, ICONS, Iconify, ChipCell } from '@asyml8/ui';

import {
  Box,
  Stack,
  Drawer,
  Avatar,
  Divider,
  MenuItem,
  Collapse,
  Typography,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

interface UserDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  user: any | null;
  onEdit: () => void;
  onViewProfile: () => void;
  onSuspend: () => void;
  onResetPassword: () => void;
  onResendInvite: () => void;
  onDelete: () => void;
  animation?: 'flyout' | 'fade';
}

export function UserDetailsDrawer({
  open,
  onClose,
  user,
  onEdit,
  onViewProfile,
  onSuspend,
  onResetPassword,
  onResendInvite,
  onDelete,
  animation = 'flyout',
}: UserDetailsDrawerProps) {
  const [quickActionsOpen, setQuickActionsOpen] = useState(true);

  if (!user) return null;

  const { supabaseUser, profile } = user;
  const name =
    profile?.displayName ??
    (`${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim() ||
      supabaseUser?.email?.split('@')[0]) ??
    'Unknown';
  const isSuspended = (supabaseUser?.user_metadata as any)?.banned ?? false;
  const isVerified = !!supabaseUser?.email_confirmed_at;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      slotProps={{
        backdrop: { invisible: animation === 'flyout' },
        paper: { sx: { width: 360 } },
      }}
    >
      <Stack spacing={3} sx={{ p: 3 }}>
        {/* Avatar & Basic Info */}
        <Stack alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 96,
              height: 96,
              fontSize: '2rem',
            }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>
          <Stack alignItems="center" spacing={0.5}>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {supabaseUser?.email}
            </Typography>
          </Stack>
        </Stack>

        <Divider />

        {/* Quick Actions */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1,
              mb: 1,
              cursor: 'pointer',
            }}
            onClick={() => setQuickActionsOpen(!quickActionsOpen)}
          >
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Quick Actions
            </Typography>
            <IconButton size="small" sx={{ p: 0 }}>
              <Iconify
                icon={
                  (quickActionsOpen
                    ? 'solar:alt-arrow-up-bold'
                    : 'solar:alt-arrow-down-bold') as any
                }
                width={16}
              />
            </IconButton>
          </Box>

          <Collapse in={quickActionsOpen}>
            <MenuItem onClick={onEdit} sx={{ py: 0.5, px: 1 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Iconify icon={ICONS.PEN} width={20} />
              </ListItemIcon>
              <ListItemText
                primary="Edit User"
                sx={{
                  '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.875rem' },
                }}
              />
            </MenuItem>

            <MenuItem onClick={onViewProfile} sx={{ py: 0.5, px: 1 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Iconify icon={ICONS.EYE} width={20} />
              </ListItemIcon>
              <ListItemText
                primary="View Full Profile"
                sx={{
                  '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.875rem' },
                }}
              />
            </MenuItem>

            <MenuItem onClick={onSuspend} sx={{ py: 0.5, px: 1 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Iconify
                  icon={'solar:pause-bold' as any}
                  width={20}
                  sx={{ color: isSuspended ? 'success.main' : 'warning.main' }}
                />
              </ListItemIcon>
              <ListItemText
                primary={isSuspended ? 'Activate User' : 'Suspend User'}
                sx={{
                  '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.875rem' },
                }}
              />
            </MenuItem>

            <MenuItem onClick={onResetPassword} sx={{ py: 0.5, px: 1 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Iconify icon={ICONS.RESTART} width={20} />
              </ListItemIcon>
              <ListItemText
                primary="Reset Password"
                sx={{
                  '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.875rem' },
                }}
              />
            </MenuItem>

            {!isVerified && (
              <MenuItem onClick={onResendInvite} sx={{ py: 0.5, px: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Iconify icon={ICONS.LETTER} width={20} />
                </ListItemIcon>
                <ListItemText
                  primary="Resend Invite"
                  sx={{
                    '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.875rem' },
                  }}
                />
              </MenuItem>
            )}

            <MenuItem onClick={onDelete} sx={{ py: 0.5, px: 1 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Iconify icon={ICONS.TRASH_BIN} width={20} sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText
                primary="Delete User"
                sx={{
                  '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.875rem' },
                }}
              />
            </MenuItem>
          </Collapse>
        </Box>

        <Divider />

        {/* Details */}
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Role
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <ChipCell
                value={(supabaseUser?.user_metadata as any)?.role ?? 'User'}
                color={
                  (supabaseUser?.user_metadata as any)?.role?.toLowerCase() === 'admin'
                    ? 'error'
                    : 'default'
                }
                variant="outlined"
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <ChipCell
                value={isVerified ? 'Verified' : 'Unverified'}
                color={isVerified ? 'success' : 'warning'}
                variant="outlined"
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Last Sign In
            </Typography>
            <Typography variant="body2">
              {supabaseUser?.last_sign_in_at ? fDate(supabaseUser.last_sign_in_at) : 'Never'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body2">
              {supabaseUser?.created_at ? fDate(supabaseUser.created_at) : 'N/A'}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Drawer>
  );
}
