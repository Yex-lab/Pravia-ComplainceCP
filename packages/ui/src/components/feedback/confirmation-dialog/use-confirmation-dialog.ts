import { useContext } from 'react';
import { ConfirmationDialogContext } from './confirmation-dialog-provider';

export function useConfirmationDialog() {
  const context = useContext(ConfirmationDialogContext);
  
  if (!context) {
    throw new Error('useConfirmationDialog must be used within a ConfirmationDialogProvider');
  }
  
  return context.confirm;
}
