'use client';

import { useMemo } from 'react';
import { EnhancedFormDialog } from '@asyml8/ui';

import { useTranslation } from 'src/hooks/use-translation';

import { userFormRows, userFormStore, type UserFormData } from 'src/store/forms/user.form';

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  user?: UserFormData | null;
  onSuccess?: () => void;
}

export function UserFormDialog({ open, onClose, user, onSuccess }: UserFormDialogProps) {
  const { t } = useTranslation();
  const mode = user?.id ? 'update' : 'create';

  // Memoize title to prevent unnecessary re-renders
  const title = useMemo(
    () => (mode === 'create' ? t('userForm.addTitle') : t('userForm.editTitle')),
    [mode, t]
  );

  const description = useMemo(
    () => (mode === 'create' ? t('userForm.createDesc') : t('userForm.updateDesc')),
    [mode, t]
  );

  return (
    <EnhancedFormDialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      store={userFormStore}
      rows={userFormRows}
      mode={mode}
      entityId={user?.id}
      defaultValues={user ?? undefined}
      maxWidth="sm"
      submitLabel={mode === 'create' ? t('userForm.create') : t('userForm.save')}
      cancelLabel={t('userForm.cancel')}
      onSuccess={onSuccess}
    />
  );
}
