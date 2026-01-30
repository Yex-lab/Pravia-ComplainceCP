import { ReactNode } from 'react';
import { SnackbarOrigin } from '@mui/material/Snackbar';
import { ExpandableNotificationError } from './notifications';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export interface NotificationOptions {
  id?: string;
  type?: NotificationType;
  message: ReactNode;
  duration?: number | null; // null = no auto-dismiss
  icon?: ReactNode;
  actions?: NotificationAction[];
  position?: SnackbarOrigin;
  closable?: boolean;
  persist?: boolean; // Don't auto-dismiss on clickaway
  // Expandable notification options
  expandable?: boolean;
  errors?: ExpandableNotificationError[];
  onRetry?: () => void;
  retryText?: string;
  detailsTitle?: string;
  expandDirection?: 'right' | 'up';
  panelColor?: 'lighter' | 'light' | 'main' | 'dark' | 'darker';
}

export interface Notification extends Required<Omit<NotificationOptions, 'icon' | 'actions' | 'errors' | 'onRetry' | 'retryText' | 'detailsTitle' | 'expandDirection' | 'panelColor'>> {
  id: string;
  icon?: ReactNode;
  actions?: NotificationAction[];
  errors?: ExpandableNotificationError[];
  onRetry?: () => void;
  retryText?: string;
  detailsTitle?: string;
  expandDirection?: 'right' | 'up';
  panelColor?: 'lighter' | 'light' | 'main' | 'dark' | 'darker';
  timestamp: number;
}
