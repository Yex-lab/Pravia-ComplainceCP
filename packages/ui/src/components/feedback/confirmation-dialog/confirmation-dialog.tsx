'use client';

import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CustomDialog } from '../custom-dialog';
import type { ConfirmationOptions } from './types';

interface ConfirmationDialogProps {
  open: boolean;
  options: ConfirmationOptions;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({ open, options, onConfirm, onCancel }: ConfirmationDialogProps) {
  const {
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    maxWidth = 'sm'
  } = options;

  const confirmColor = variant === 'danger' ? 'error' : variant === 'warning' ? 'warning' : 'primary';

  return (
    <CustomDialog
      open={open}
      onClose={onCancel}
      title={title}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={onCancel} variant="outlined" color="inherit">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} variant="contained" color={confirmColor}>
            {confirmText}
          </Button>
        </>
      }
    >
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </CustomDialog>
  );
}
