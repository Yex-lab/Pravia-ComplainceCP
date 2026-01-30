'use client';

import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export interface ExpandableNotificationError {
  service: string;
  message: string;
}

export interface ExpandableNotificationProps {
  message: React.ReactNode;
  type: 'error' | 'warning' | 'info' | 'success';
  errors?: ExpandableNotificationError[];
  onClose: () => void;
  onRetry?: () => void;
  retryText?: string;
  detailsTitle?: string;
  expandDirection?: 'right' | 'up';
  panelColor?: 'lighter' | 'light' | 'main' | 'dark' | 'darker';
}

const ANIMATION_DURATION = 0.3;
const PANEL_WIDTH = 320;
const PANEL_HEIGHT = 300;

const GPU_OPTIMIZED_STYLE = {
  willChange: 'transform',
  transform: 'translateZ(0)',
};

export function ExpandableNotification({
  message,
  type,
  errors = [],
  onClose,
  onRetry,
  retryText = 'Retry',
  detailsTitle = 'Error Details',
  expandDirection = 'right',
  panelColor = 'dark',
}: ExpandableNotificationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const isHorizontal = expandDirection === 'right';

  const handleToggle = async () => {
    if (isExpanded) {
      // Collapsing: fade out alert, collapse panel, then fade in alert
      setShowAlert(false);
      await new Promise((resolve) => setTimeout(resolve, 200)); // Alert fade out
      setIsExpanded(false); // Collapse panel
      await new Promise((resolve) => setTimeout(resolve, 300)); // Panel collapse animation
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms
      setShowAlert(true); // Fade alert back in
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column-reverse',
        gap: 0,
      }}
    >
      {/* Main notification */}
      <m.div
        animate={{ 
          opacity: showAlert ? 1 : 0
        }}
        transition={{ 
          duration: 0.2
        }}
        style={{ willChange: 'opacity' }}
      >
        <Alert
          severity={type}
          sx={{
            minWidth: 320,
            maxWidth: 400,
            boxShadow: 6,
            borderRadius: isExpanded 
              ? isHorizontal ? '12px 0 0 12px' : '12px 12px 0 0'
              : '12px',
            transition: `border-radius ${ANIMATION_DURATION}s`,
            willChange: 'border-radius, transform',
            transform: 'translateZ(0)',
          }}
          action={
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              {errors.length > 0 && (
                <IconButton
                  size="small"
                  onClick={handleToggle}
                  sx={{ color: 'inherit' }}
                >
                  {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
              )}
              {onClose && (
                <IconButton size="small" onClick={onClose} sx={{ color: 'inherit' }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          }
        >
          {typeof message === 'string' ? message : message}
        </Alert>
      </m.div>

      {/* Slide-out panel */}
      <AnimatePresence>
        {isExpanded && (
          <m.div
            initial={isHorizontal ? { width: 0 } : { height: 0 }}
            animate={isHorizontal ? { width: PANEL_WIDTH } : { height: PANEL_HEIGHT }}
            exit={isHorizontal ? { width: 0 } : { height: 0 }}
            transition={{ duration: ANIMATION_DURATION }}
            style={{
              overflow: 'hidden',
              willChange: isHorizontal ? 'width' : 'height',
              contain: 'layout',
            }}
          >
            <m.div
              initial={isHorizontal ? { x: -PANEL_WIDTH } : { y: PANEL_HEIGHT }}
              animate={isHorizontal ? { x: 0 } : { y: 0 }}
              exit={isHorizontal ? { x: -PANEL_WIDTH } : { y: PANEL_HEIGHT }}
              transition={{ duration: ANIMATION_DURATION }}
              style={{ willChange: 'transform' }}
            >
              <Box
                sx={{
                  width: isHorizontal ? PANEL_WIDTH : 320,
                  height: isHorizontal ? '100%' : PANEL_HEIGHT,
                  bgcolor: (theme) => theme.palette[type][panelColor],
                  color: (theme) => theme.palette[type].contrastText,
                  boxShadow: 6,
                  borderRadius: isHorizontal ? '0 12px 12px 12px' : '0 0 12px 12px',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  contain: 'layout style paint',
                  ...GPU_OPTIMIZED_STYLE,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {detailsTitle}
                </Typography>

                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  {errors.map((error, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 1.5,
                        p: 1.5,
                        bgcolor: `${type}.lighter`,
                        borderRadius: 1,
                        border: 1,
                        borderColor: `${type}.light`,
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', color: `${type}.darker` }}>
                        {error.service}
                      </Typography>
                      <Typography variant="caption" sx={{ color: `${type}.dark` }}>
                        {error.message}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {onRetry && (
                  <Button
                    variant="contained"
                    color={type}
                    size="small"
                    onClick={() => {
                      onRetry();
                      onClose();
                    }}
                    fullWidth
                    sx={{ 
                      bgcolor: 'white',
                      color: `${type}.darker`,
                      '&:hover': {
                        bgcolor: 'grey.100',
                      }
                    }}
                  >
                    {retryText}
                  </Button>
                )}
              </Box>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
