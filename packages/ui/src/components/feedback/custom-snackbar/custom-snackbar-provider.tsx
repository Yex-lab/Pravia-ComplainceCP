'use client';

import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import { AnimatePresence } from 'framer-motion';

import { useNotificationStore } from './notification-store';
import { StandardNotification } from './notifications/standard-notification';
import { ExpandableNotification } from './notifications/expandable-notification';

interface CustomSnackbarProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  transitionDuration?: number;
}

export function CustomSnackbarProvider({ 
  children, 
  maxNotifications = 3,
  transitionDuration = 300
}: CustomSnackbarProviderProps) {
  const { notifications, removeNotification } = useNotificationStore();
  const [exitingNotifications, setExitingNotifications] = useState<Set<string>>(new Set());

  // Show only the most recent notifications up to maxNotifications
  const visibleNotifications = notifications.slice(-maxNotifications);

  const handleClose = (notificationId: string, reason?: string) => {
    if (reason === 'clickaway') {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification?.persist) return;
    }
    
    const notification = notifications.find(n => n.id === notificationId);
    
    // For expandable notifications, remove immediately (AnimatePresence handles exit)
    if (notification?.expandable) {
      removeNotification(notificationId);
      return;
    }
    
    // For standard notifications, use exiting state
    setExitingNotifications(prev => new Set(prev).add(notificationId));
    
    setTimeout(() => {
      removeNotification(notificationId);
      setExitingNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }, transitionDuration);
  };

  return (
    <>
      {children}
      <AnimatePresence>
        {visibleNotifications.map((notification, index) => {
          // Render expandable notification without Snackbar wrapper
          if (notification.expandable) {
            return (
              <div
                key={notification.id}
                style={{
                  position: 'fixed',
                  bottom: 24,
                  right: 24,
                  zIndex: 9999,
                  transform: `translateY(${-index * 70}px)`,
                }}
              >
                <ExpandableNotification
                  message={notification.message}
                  type={notification.type}
                  errors={notification.errors}
                  onClose={() => handleClose(notification.id)}
                  onRetry={notification.onRetry}
                  retryText={notification.retryText}
                  detailsTitle={notification.detailsTitle}
                  expandDirection={notification.expandDirection}
                  panelColor={notification.panelColor}
                />
              </div>
            );
          }

          // Render standard notification with Snackbar wrapper
          return (
          <Snackbar
            key={notification.id}
            open={!exitingNotifications.has(notification.id)}
            anchorOrigin={notification.position}
            onClose={(_, reason) => handleClose(notification.id, reason)}
            TransitionComponent={Fade}
            transitionDuration={transitionDuration}
            sx={{
              // Stack notifications vertically
              transform: `translateY(${-index * 70}px)`,
            }}
          >
            <div>
              <StandardNotification
                message={notification.message}
                type={notification.type}
                icon={notification.icon}
                actions={notification.actions}
                closable={notification.closable}
                onClose={() => handleClose(notification.id)}
              />
            </div>
          </Snackbar>
        );
      })}
      </AnimatePresence>
    </>
  );
}
