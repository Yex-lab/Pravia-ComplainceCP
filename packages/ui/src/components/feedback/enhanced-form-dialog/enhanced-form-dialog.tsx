'use client';

import React from 'react';
import { DialogActions, Button } from '@mui/material';
import { CustomDialog } from '../custom-dialog';
import { EnhancedFormBuilder } from '../../inputs/form-builder/enhanced-form-builder';

export interface EnhancedFormDialogProps<T = any> {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  store: any;
  rows: any[];
  mode: 'create' | 'update';
  entityId?: string;
  defaultValues?: Record<string, any>;
  onSuccess?: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  submitLabel?: string;
  cancelLabel?: string;
}

export function EnhancedFormDialog<T = any>({
  open,
  onClose,
  title,
  description,
  store,
  rows,
  mode,
  entityId,
  defaultValues,
  onSuccess,
  maxWidth = 'md',
  submitLabel,
  cancelLabel = 'Cancel'
}: EnhancedFormDialogProps<T>) {
  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={onClose} variant="outlined" color="inherit">
            {cancelLabel}
          </Button>
          <Button 
            type="submit"
            form="enhanced-form"
            variant="contained"
            color="inherit"
          >
            {submitLabel || (mode === 'create' ? 'Create' : 'Save')}
          </Button>
        </>
      }
    >
      <EnhancedFormBuilder
        rows={rows}
        store={store}
        mode={mode}
        entityId={entityId}
        defaultValues={defaultValues}
        hideSubmitButton
        onSuccess={handleSuccess}
      />
    </CustomDialog>
  );
}
