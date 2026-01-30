'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import Check from '@mui/icons-material/Check';
import { Iconify } from '../../data-display/iconify';
import { StepperVariantProps } from './types';
import { StepContainer, StepCircle, StepConnectorLine } from './styled';

const ArrowStepContainer = styled(Box)<{
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
  isNext: boolean;
}>(({ theme, isActive, isCompleted, isLast, isNext }) => {
  const bgColor = isCompleted || isActive 
    ? theme.palette.primary.main 
    : isNext 
      ? theme.palette.grey[200]
      : theme.palette.background.paper;
  
  const borderColor = (!isCompleted && !isActive && !isNext) ? theme.palette.divider : 'transparent';
  
  const arrowPath = isLast 
    ? `M 8 0 L 192 0 Q 200 0 200 8 L 200 52 Q 200 60 192 60 L 8 60 Q 0 60 0 52 L 0 30 L 15 30 Q 20 30 20 25 Q 20 20 15 20 L 0 20 L 0 8 Q 0 0 8 0 Z`
    : `M 8 0 L 172 0 Q 180 0 185 8 L 195 25 Q 200 30 195 35 L 185 52 Q 180 60 172 60 L 8 60 Q 0 60 0 52 L 0 30 L 15 30 Q 20 30 20 25 Q 20 20 15 20 L 0 20 L 0 8 Q 0 0 8 0 Z`;

  return {
    position: 'relative',
    height: 60,
    minWidth: 200,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: isLast ? 20 : 40,
    marginRight: 12,
    color: isCompleted || isActive ? theme.palette.primary.contrastText : theme.palette.text.secondary,
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
        <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
          <path d="${arrowPath}" fill="${bgColor}" stroke="${borderColor}" stroke-width="2"/>
        </svg>
      `)}")`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
    },

    ...theme.applyStyles('dark', {
      color: isCompleted || isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
    }),
  };
});

export function IconStepper({ steps, activeStep, gradient, color, stepLineColor, size }: StepperVariantProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        const isLast = index === steps.length - 1;

        return (
          <StepContainer
            key={step.label}
            isActive={isActive}
            isCompleted={isCompleted}
            isLast={isLast}
          >
            <StepCircle isActive={isActive} isCompleted={isCompleted} color={color} size={size}>
              {isActive && isLast ? (
                <Iconify 
                  icon={"solar:like-bold" as any}
                  width={size === 'small' ? 16 : 24} 
                  sx={{ color: gradient ? 'transparent' : (color || 'primary.main') }}
                />
              ) : (
                <Iconify 
                  icon={(step.icon || 'solar:settings-bold-duotone') as any} 
                  width={size === 'small' ? 16 : 24}
                  sx={{ color: isCompleted ? 'white' : isActive ? (color || 'primary.main') : 'grey.400' }}
                />
              )}
            </StepCircle>
            
            {!isLast && (
              <StepConnectorLine 
                isCompleted={isCompleted} 
                isActive={index === activeStep - 1}
                stepLineColor={stepLineColor}
                size={size}
                isNextToActive={index === activeStep - 1 || index === activeStep}
              />
            )}
            
            <Box sx={{ textAlign: 'center', maxWidth: isLast ? 200 : 160 }}>
              <Box sx={{ 
                fontWeight: isActive ? 'bold' : 'normal',
                fontSize: '0.875rem',
                color: isCompleted || isActive ? 'text.primary' : 'text.secondary',
                mb: 0.5
              }}>
                {step.label}
              </Box>
              {step.description && (
                <Box sx={{ 
                  fontSize: '0.75rem', 
                  color: 'text.secondary',
                  opacity: 0.7,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {step.description}
                </Box>
              )}
            </Box>
          </StepContainer>
        );
      })}
    </Box>
  );
}

export function NumberedStepper({ steps, activeStep, color, stepLineColor, size }: StepperVariantProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        const isLast = index === steps.length - 1;

        return (
          <StepContainer
            key={step.label}
            isActive={isActive}
            isCompleted={isCompleted}
            isLast={isLast}
          >
            <StepCircle isActive={isActive} isCompleted={isCompleted} color={color} size={size}>
              {isCompleted ? (
                <Check sx={{ fontSize: size === 'small' ? 16 : size === 'large' ? 32 : 28 }} />
              ) : isActive && isLast ? (
                <Check sx={{ fontSize: size === 'small' ? 16 : size === 'large' ? 32 : 28 }} />
              ) : (
                <Box sx={{
                  width: size === 'small' ? 8 : size === 'large' ? 20 : 16,
                  height: size === 'small' ? 8 : size === 'large' ? 20 : 16,
                  borderRadius: '50%',
                  backgroundColor: isCompleted || isActive ? 'primary.main' : 'grey.400',
                }} />
              )}
            </StepCircle>
            
            {!isLast && (
              <StepConnectorLine 
                isCompleted={isCompleted} 
                isActive={index === activeStep - 1}
                stepLineColor={stepLineColor}
                size={size}
                isNextToActive={index === activeStep - 1 || index === activeStep}
              />
            )}
            
            <Box sx={{ textAlign: 'center', maxWidth: 120 }}>
              <Box sx={{ 
                fontWeight: isActive ? 'bold' : 'normal',
                fontSize: '0.875rem',
                color: isCompleted || isActive ? 'text.primary' : 'text.secondary',
                mb: 0.5
              }}>
                {step.label}
              </Box>
              {step.description && (
                <Box sx={{ 
                  fontSize: '0.75rem', 
                  color: 'text.secondary',
                  opacity: 0.7
                }}>
                  {step.description}
                </Box>
              )}
            </Box>
          </StepContainer>
        );
      })}
    </Box>
  );
}

export function ArrowStepper({ steps, activeStep, color, stepLineColor }: StepperVariantProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        const isNext = index === activeStep + 1;
        const isLast = index === steps.length - 1;

        return (
          <ArrowStepContainer
            key={step.label}
            isActive={isActive}
            isCompleted={isCompleted}
            isNext={isNext}
            isLast={isLast}
          >
            <Box>
              <Box sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                {step.label}
              </Box>
              {step.description && (
                <Box sx={{ fontSize: '0.75rem', opacity: 0.8, mt: 0.5 }}>
                  {step.description}
                </Box>
              )}
            </Box>
          </ArrowStepContainer>
        );
      })}
    </Box>
  );
}
