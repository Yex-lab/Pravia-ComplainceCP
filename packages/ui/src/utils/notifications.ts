import React from 'react';
import { CircularProgress } from '@mui/material';
import { showNotification, showSuccess, showError, dismissNotification } from '../components/feedback/custom-snackbar';

interface NotificationMessages {
  loading: string;
  success: string;
  error?: string | ((error: any) => string);
}

/**
 * Wraps an async operation with loading, success, and error notifications
 * @param operation - The async operation to execute
 * @param messages - Notification messages for loading, success, and error states
 * @returns Promise that resolves with the operation result
 */
export async function withNotifications<T>(
  operation: () => Promise<T>,
  messages: NotificationMessages
): Promise<T> {
  const loadingId = showNotification({
    type: 'info',
    message: messages.loading,
    icon: React.createElement(CircularProgress, { size: 20 }),
    duration: null
  });

  try {
    const result = await operation();
    dismissNotification(loadingId);
    showSuccess(messages.success);
    return result;
  } catch (error: any) {
    dismissNotification(loadingId);
    
    let errorMessage: string;
    if (typeof messages.error === 'function') {
      errorMessage = messages.error(error);
    } else {
      errorMessage = messages.error || 'Operation failed. Please try again.';
    }
    
    showError(errorMessage);
    throw error;
  }
}
