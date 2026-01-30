'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { ConfirmationDialog } from './confirmation-dialog';
import type { ConfirmationOptions, ConfirmationDialogContextType } from './types';

const ConfirmationDialogContext = createContext<ConfirmationDialogContextType | null>(null);

interface ConfirmationDialogProviderProps {
  children: ReactNode;
}

export function ConfirmationDialogProvider({ children }: ConfirmationDialogProviderProps) {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    options: ConfirmationOptions;
    resolve: ((value: boolean) => void) | null;
  }>({
    open: false,
    options: { title: '', message: '' },
    resolve: null,
  });

  const confirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        open: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (dialogState.resolve) {
      dialogState.resolve(true);
    }
    setDialogState(prev => ({ ...prev, open: false, resolve: null }));
  }, [dialogState.resolve]);

  const handleCancel = useCallback(() => {
    if (dialogState.resolve) {
      dialogState.resolve(false);
    }
    setDialogState(prev => ({ ...prev, open: false, resolve: null }));
  }, [dialogState.resolve]);

  return (
    <ConfirmationDialogContext.Provider value={{ confirm }}>
      {children}
      <ConfirmationDialog
        open={dialogState.open}
        options={dialogState.options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmationDialogContext.Provider>
  );
}

export { ConfirmationDialogContext };
