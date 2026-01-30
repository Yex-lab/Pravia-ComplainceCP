'use client';

import { useMemo } from 'react';
import { EnhancedFormDialog } from '@asyml8/ui';

import { addUserFormRows, addUserFormStore } from 'src/store/forms/user-add.form';

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddUserDialog({ open, onClose, onSuccess }: AddUserDialogProps) {
  const mode = 'create';

  // Memoize title to prevent unnecessary re-renders
  const title = useMemo(() => 'Add New User', []);

  const description = useMemo(
    () =>
      'Create a new user account with profile information. If no password is provided, the user will receive a magic link to set their password.',
    []
  );

  return (
    <EnhancedFormDialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      store={addUserFormStore}
      rows={addUserFormRows}
      mode={mode}
      entityId={undefined}
      defaultValues={undefined}
      maxWidth="sm"
      submitLabel="Create User"
      cancelLabel="Cancel"
      onSuccess={onSuccess}
    />
  );
}
