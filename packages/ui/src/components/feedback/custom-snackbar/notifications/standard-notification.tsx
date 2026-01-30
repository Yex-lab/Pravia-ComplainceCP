'use client';

import React from 'react';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

import { NotificationType, NotificationAction } from '../types';

const defaultIcons: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircleIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />,
};

export interface StandardNotificationProps {
  message: React.ReactNode;
  type: NotificationType;
  icon?: React.ReactNode;
  actions?: NotificationAction[];
  closable: boolean;
  onClose: () => void;
}

export function StandardNotification({
  message,
  type,
  icon,
  actions,
  closable,
  onClose,
}: StandardNotificationProps) {
  return (
    <Alert
      severity={type}
      icon={icon || defaultIcons[type]}
      action={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Custom actions */}
          {actions?.map((action, actionIndex) => (
            <Button
              key={actionIndex}
              size="small"
              variant={action.variant || 'text'}
              color={action.color || 'inherit'}
              onClick={() => {
                action.onClick();
                onClose();
              }}
            >
              {action.label}
            </Button>
          ))}
          
          {/* Close button */}
          {closable && (
            <IconButton
              size="small"
              color="inherit"
              onClick={onClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      }
      sx={{
        width: '100%',
        maxWidth: 400,
        '& .MuiAlert-message': {
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          wordBreak: 'break-word',
        },
      }}
    >
      {typeof message === 'string' ? message : message}
    </Alert>
  );
}
