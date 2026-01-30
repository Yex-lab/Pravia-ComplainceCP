import { ReactNode } from 'react';
import { useNotificationStore } from './notification-store';
import { NotificationOptions, NotificationAction } from './types';
import { ExpandableNotificationError } from './notifications';

// Get the store instance for use outside React components
const getNotificationStore = () => useNotificationStore.getState();

// Generic notification function
export const showNotification = (options: NotificationOptions): string => {
  return getNotificationStore().addNotification(options);
};

// Convenience functions for common types
export const showSuccess = (
  message: ReactNode,
  options?: Omit<NotificationOptions, 'message' | 'type'>
): string => {
  return showNotification({ ...options, message, type: 'success' });
};

export const showError = (
  message: ReactNode,
  options?: Omit<NotificationOptions, 'message' | 'type'>
): string => {
  return showNotification({ ...options, message, type: 'error' });
};

export const showWarning = (
  message: ReactNode,
  options?: Omit<NotificationOptions, 'message' | 'type'>
): string => {
  return showNotification({ ...options, message, type: 'warning' });
};

export const showInfo = (
  message: ReactNode,
  options?: Omit<NotificationOptions, 'message' | 'type'>
): string => {
  return showNotification({ ...options, message, type: 'info' });
};

// Expandable error notification
export const showExpandableError = (
  message: ReactNode,
  errors: ExpandableNotificationError[],
  options?: Omit<NotificationOptions, 'message' | 'type' | 'expandable' | 'errors'>
): string => {
  return showNotification({
    ...options,
    message,
    type: 'error',
    expandable: true,
    errors,
    duration: null, // Don't auto-dismiss by default
  });
};

// Utility functions
export const dismissNotification = (id: string): void => {
  getNotificationStore().removeNotification(id);
};

export const clearAllNotifications = (): void => {
  getNotificationStore().clearAll();
};

// Hook for React components
export const useNotifications = () => {
  const { notifications, removeNotification, clearAll } = useNotificationStore();
  
  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showExpandableError,
    dismissNotification: removeNotification,
    clearAll,
  };
};
