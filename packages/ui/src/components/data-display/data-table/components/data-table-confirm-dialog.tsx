'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import type { ConfirmDialogState, DataTableConfirmDialogProps } from '../types';

export function DataTableConfirmDialog({
  confirmDialog,
  onClose,
  onConfirm,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  confirmColor = 'error',
}: DataTableConfirmDialogProps) {
  return (
    <Dialog open={confirmDialog.open} onClose={onClose}>
      <DialogTitle>{confirmDialog.title}</DialogTitle>
      <DialogContent>{confirmDialog.content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelLabel}</Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
