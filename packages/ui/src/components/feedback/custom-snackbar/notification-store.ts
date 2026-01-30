'use client';

import { create } from 'zustand';
import { Notification, NotificationOptions } from './types';

interface NotificationStore {
  notifications: Notification[];
  addNotification: (options: NotificationOptions) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const generateId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  addNotification: (options: NotificationOptions) => {
    const id = options.id || generateId();

    const notification: Notification = {
      id,
      type: options.type || 'info',
      message: options.message,
      duration: options.duration !== undefined ? options.duration : 1500,
      position: options.position || { vertical: 'bottom', horizontal: 'right' },
      closable: options.closable !== undefined ? options.closable : true,
      persist: options.persist || false,
      expandable: options.expandable || false,
      icon: options.icon,
      actions: options.actions,
      errors: options.errors,
      onRetry: options.onRetry,
      retryText: options.retryText,
      detailsTitle: options.detailsTitle,
      expandDirection: options.expandDirection,
      panelColor: options.panelColor,
      timestamp: Date.now(),
    };

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    // Auto-dismiss if duration is set
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration);
    }

    return id;
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },
}));
