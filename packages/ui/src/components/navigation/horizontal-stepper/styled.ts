'use client';

import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

export const StepContainer = styled(Box, {
  shouldForwardProp: (prop) => !['isActive', 'isCompleted', 'isLast'].includes(prop as string),
})<{
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
}>(({ theme, isActive, isCompleted, isLast }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  position: 'relative',
}));

export const StepCircle = styled(Box, {
  shouldForwardProp: (prop) => !['isActive', 'isCompleted', 'color', 'size'].includes(prop as string),
})<{
  isActive: boolean;
  isCompleted: boolean;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}>(({ theme, isActive, isCompleted, color, size = 'medium' }) => {
  const primaryColor = color || theme.palette.primary.main;
  const circleSize = size === 'small' ? 20 : size === 'large' ? 48 : 40;
  const fontSize = size === 'small' ? '0.75rem' : size === 'large' ? '1rem' : '0.875rem';
  
  return {
    width: circleSize,
    height: circleSize,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: fontSize,
    fontWeight: 'bold',
    marginBottom: 12,
    zIndex: 2,
    backgroundColor: isCompleted ? primaryColor : 'transparent',
    border: `2px solid ${isCompleted || isActive ? primaryColor : theme.palette.grey[400]}`,
    color: isCompleted ? 'white' : theme.palette.text.primary,
    transition: isCompleted 
      ? 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease'
      : 'background-color 0.2s ease 0.3s, border-color 0.2s ease 0.3s, color 0.2s ease 0.3s, transform 0.2s ease 0.3s, box-shadow 0.2s ease 0.3s',
    transform: isActive ? 'scale(1.1)' : 'scale(1)',
    boxShadow: isActive ? `0 0 0 4px ${primaryColor}40` : 'none',
    animation: isActive ? 'pulse 0.3s ease 0.3s' : 'none',

    '@keyframes pulse': {
      '0%': { boxShadow: `0 0 0 0px ${primaryColor}40` },
      '50%': { boxShadow: `0 0 0 8px ${primaryColor}60` },
      '100%': { boxShadow: `0 0 0 4px ${primaryColor}40` },
    },

    ...theme.applyStyles('dark', {
      border: `2px solid ${isCompleted || isActive ? primaryColor : theme.palette.grey[600]}`,
    }),
  };
});

export const StepConnectorLine = styled(Box, {
  shouldForwardProp: (prop) => !['isCompleted', 'isActive', 'stepLineColor', 'size', 'isNextToActive'].includes(prop as string),
})<{
  isCompleted: boolean;
  isActive: boolean;
  stepLineColor?: string;
  size?: 'small' | 'medium' | 'large';
  isNextToActive?: boolean;
}>(({ theme, isCompleted, isActive, stepLineColor, size = 'medium', isNextToActive }) => {
  const lineColor = stepLineColor || theme.palette.primary.main;
  
  // Size-specific positioning
  const topPosition = size === 'small' ? 8 : size === 'large' ? 22 : 18; // Small: 20px circle, Medium: 40px circle, Large: 48px circle
  const baseGap = size === 'small' ? 18 : size === 'large' ? 32 : 28; // Larger gap for large circles
  const activeGap = isNextToActive ? (size === 'small' ? 20 : size === 'large' ? 36 : 32) : baseGap;
  
  return {
    position: 'absolute',
    top: topPosition,
    left: `calc(50% + ${activeGap}px)`,
    right: `calc(-50% + ${activeGap}px)`,
    height: 4,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 2,
    zIndex: 1,
    overflow: 'hidden',

    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: isCompleted ? '100%' : isActive ? '100%' : '0%',
      backgroundColor: lineColor,
      transition: 'width 0.4s ease-out',
      borderRadius: 2,
    },

    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700],
    }),
  };
});

export const DotsConnector = styled(StepConnector)<{ gap?: number }>(({ theme, gap = 0 }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: `calc(-50% + 16px + ${gap}px)`,
    right: `calc(50% + 16px + ${gap}px)`,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[300],
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

export const GradientConnector = styled(StepConnector)<{ gradient?: string; gap?: number }>(({ theme, gradient, gap = 0 }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 25,
    left: `calc(-50% + 25px + ${gap}px)`,
    right: `calc(50% + 25px + ${gap}px)`,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: gradient || 'linear-gradient(95deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: gradient || 'linear-gradient(95deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 1,
  },
}));
