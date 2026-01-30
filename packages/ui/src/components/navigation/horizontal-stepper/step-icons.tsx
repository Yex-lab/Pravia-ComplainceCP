'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import { StepIconProps } from '@mui/material/StepIcon';
import { Iconify } from '../../data-display/iconify';

const DotsStepIconRoot = styled('div')<{ ownerState: { active?: boolean }; size: 'small' | 'medium' | 'large' }>(
  ({ theme, size }) => {
    const sizes = { small: 16, medium: 22, large: 28 };
    const iconSize = sizes[size];
    
    return {
      color: theme.palette.grey[300],
      display: 'flex',
      height: iconSize,
      alignItems: 'center',
      '& .DotsStepIcon-completedIcon': {
        color: theme.palette.primary.main,
        zIndex: 1,
        fontSize: iconSize - 4,
      },
      '& .DotsStepIcon-circle': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
      },
      variants: [
        {
          props: ({ ownerState }) => ownerState.active,
          style: {
            color: theme.palette.primary.main,
          },
        },
      ],
    };
  }
);

const GradientStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
  size: 'small' | 'medium' | 'large';
  gradient?: string;
}>(({ theme, size, gradient }) => {
  const sizes = { small: 40, medium: 50, large: 60 };
  const iconSize = sizes[size];
  const defaultGradient = 'linear-gradient(136deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
  
  return {
    backgroundColor: theme.palette.grey[400],
    zIndex: 1,
    color: '#fff',
    width: iconSize,
    height: iconSize,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    variants: [
      {
        props: ({ ownerState }) => ownerState.active,
        style: {
          background: gradient || defaultGradient,
          boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        },
      },
      {
        props: ({ ownerState }) => ownerState.completed,
        style: {
          background: gradient || defaultGradient,
        },
      },
    ],
  };
});

const OutlineStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
  size: 'small' | 'medium' | 'large';
  gradient?: string;
}>(({ theme, size, gradient }) => {
  const sizes = { small: 40, medium: 50, large: 60 };
  const iconSize = sizes[size];
  
  return {
    backgroundColor: 'transparent',
    border: `2px solid ${theme.palette.grey[300]}`,
    zIndex: 1,
    color: theme.palette.grey[400],
    width: iconSize,
    height: iconSize,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    variants: [
      {
        props: ({ ownerState }) => ownerState.completed,
        style: {
          backgroundColor: gradient ? `linear-gradient(135deg, ${gradient})` : theme.palette.primary.main,
          border: 'none',
          color: '#fff',
        },
      },
      {
        props: ({ ownerState }) => ownerState.active,
        style: {
          backgroundColor: gradient ? `linear-gradient(135deg, ${gradient.replace('100%', '30%')})` : theme.palette.primary.light,
          border: `2px solid ${gradient ? gradient.split(',')[0].replace('linear-gradient(135deg, ', '') : theme.palette.primary.main}`,
          color: gradient ? gradient.split(',')[0].replace('linear-gradient(135deg, ', '') : theme.palette.primary.main,
        },
      },
    ],
  };
});

export function DotsStepIcon({ active, completed, className, size = 'medium' }: StepIconProps & { size?: 'small' | 'medium' | 'large' }) {
  return (
    <DotsStepIconRoot ownerState={{ active }} className={className} size={size}>
      {completed ? (
        <Check className="DotsStepIcon-completedIcon" />
      ) : (
        <div className="DotsStepIcon-circle" />
      )}
    </DotsStepIconRoot>
  );
}

export function GradientStepIcon({ 
  active, 
  completed, 
  className, 
  icon, 
  size = 'medium', 
  gradient,
  iconName 
}: StepIconProps & { 
  size?: 'small' | 'medium' | 'large'; 
  gradient?: string;
  iconName?: string;
}) {
  const iconSizes = { small: 20, medium: 24, large: 28 };
  const iconSize = iconSizes[size];

  return (
    <GradientStepIconRoot 
      ownerState={{ completed, active }} 
      className={className} 
      size={size}
      gradient={gradient}
    >
      {completed ? (
        <Check sx={{ fontSize: iconSize }} />
      ) : iconName ? (
        <Iconify icon={iconName as any} width={iconSize} />
      ) : (
        String(icon)
      )}
    </GradientStepIconRoot>
  );
}

export function OutlineStepIcon({ 
  active, 
  completed, 
  className, 
  icon, 
  size = 'medium', 
  gradient,
  iconName 
}: StepIconProps & { 
  size?: 'small' | 'medium' | 'large'; 
  gradient?: string;
  iconName?: string;
}) {
  const iconSizes = { small: 16, medium: 20, large: 24 };
  const iconSize = iconSizes[size];

  return (
    <OutlineStepIconRoot 
      ownerState={{ completed, active }} 
      className={className} 
      size={size}
      gradient={gradient}
    >
      {completed ? (
        <Check sx={{ fontSize: iconSize }} />
      ) : iconName ? (
        <Iconify icon={iconName as any} width={iconSize} />
      ) : (
        <div style={{ 
          width: 6, 
          height: 6, 
          borderRadius: '50%', 
          backgroundColor: 'currentColor' 
        }} />
      )}
    </OutlineStepIconRoot>
  );
}
