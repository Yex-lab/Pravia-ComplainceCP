'use client';

import * as React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';
import { StepIconProps } from '@mui/material/StepIcon';
import { Box, Button } from '@mui/material';
import { HorizontalStepperProps, StepData } from './types';
import { DotsConnector, GradientConnector } from './styled';
import { DotsStepIcon, GradientStepIcon, OutlineStepIcon } from './step-icons';
import { IconStepper, NumberedStepper, ArrowStepper } from './variants';

export function HorizontalStepper({
  steps,
  activeStep,
  variant = 'dots',
  size = 'medium',
  gradient,
  color,
  stepLineColor,
  showButtons = false,
  onNext,
  onBack,
  onStepClick,
  nextLabel = 'Next',
  backLabel = 'Back',
  finishLabel = 'Finish',
  connectorGap = 0,
  // Legacy props for backward compatibility
  icons = [],
  stepDescriptions = [],
}: HorizontalStepperProps) {
  
  // Normalize steps to StepData format
  const normalizedSteps: StepData[] = steps.map((step, index) => {
    if (typeof step === 'string') {
      return {
        id: `step-${index}`,
        label: step,
        description: stepDescriptions[index],
        icon: icons[index],
      };
    }
    return {
      id: step.id || `step-${index}`,
      ...step,
    };
  });

  // Determine active step from step status if not provided
  const currentActiveStep = activeStep ?? normalizedSteps.findIndex(step => step.status === 'active');

  if (variant === 'icon') {
    return (
      <Box>
        <IconStepper steps={normalizedSteps} activeStep={currentActiveStep} gradient={gradient} color={color} stepLineColor={stepLineColor} size={size} />
        {showButtons && (
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button onClick={onBack} disabled={currentActiveStep === 0} variant="outlined">
              {backLabel}
            </Button>
            <Button onClick={onNext} disabled={currentActiveStep === steps.length - 1 && !onNext} variant="contained">
              {currentActiveStep === steps.length - 1 ? finishLabel : nextLabel}
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  if (variant === 'numbered') {
    return (
      <Box>
        <NumberedStepper steps={normalizedSteps} activeStep={currentActiveStep} gradient={gradient} color={color} stepLineColor={stepLineColor} size={size} />
        {showButtons && (
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button onClick={onBack} disabled={currentActiveStep === 0} variant="outlined">
              {backLabel}
            </Button>
            <Button onClick={onNext} disabled={currentActiveStep === steps.length - 1 && !onNext} variant="contained">
              {currentActiveStep === steps.length - 1 ? finishLabel : nextLabel}
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  if (variant === 'arrow') {
    return (
      <Box>
        <ArrowStepper steps={normalizedSteps} activeStep={currentActiveStep} gradient={gradient} color={color} stepLineColor={stepLineColor} />
        {showButtons && (
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button onClick={onBack} disabled={currentActiveStep === 0} variant="outlined">
              {backLabel}
            </Button>
            <Button onClick={onNext} disabled={currentActiveStep === steps.length - 1 && !onNext} variant="contained">
              {currentActiveStep === steps.length - 1 ? finishLabel : nextLabel}
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  const StepIconComponent = (props: StepIconProps) => {
    switch (variant) {
      case 'gradient':
        return <GradientStepIcon {...props} gradient={gradient} />;
      case 'outline':
        return <OutlineStepIcon {...props} />;
      default:
        return <DotsStepIcon {...props} />;
    }
  };

  const ConnectorComponent = variant === 'gradient' ? GradientConnector : DotsConnector;

  return (
    <Box>
      <Stepper
        activeStep={currentActiveStep}
        connector={<ConnectorComponent sx={{ marginLeft: `${connectorGap}px`, marginRight: `${connectorGap}px` }} />}
        sx={{
          '& .MuiStepConnector-root': {
            top: size === 'large' ? 15 : size === 'small' ? 10 : 12,
          },
        }}
      >
        {normalizedSteps.map((step, index) => (
          <Step key={step.id} completed={step.status === 'completed'} disabled={step.disabled}>
            {onStepClick ? (
              <StepButton onClick={() => onStepClick(step.id!, index)}>
                <StepLabel
                  StepIconComponent={StepIconComponent}
                  optional={step.optional ? <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Optional</Box> : undefined}
                  error={step.status === 'error'}
                >
                  {step.label}
                  {step.description && (
                    <Box component="div" sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
                      {step.description}
                    </Box>
                  )}
                </StepLabel>
              </StepButton>
            ) : (
              <StepLabel
                StepIconComponent={StepIconComponent}
                optional={step.optional ? <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Optional</Box> : undefined}
                error={step.status === 'error'}
              >
                {step.label}
                {step.description && (
                  <Box component="div" sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
                    {step.description}
                  </Box>
                )}
              </StepLabel>
            )}
          </Step>
        ))}
      </Stepper>
      {showButtons && (
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button onClick={onBack} disabled={currentActiveStep === 0} variant="outlined">
            {backLabel}
          </Button>
          <Button onClick={onNext} disabled={currentActiveStep === steps.length - 1 && !onNext} variant="contained">
            {currentActiveStep === steps.length - 1 ? finishLabel : nextLabel}
          </Button>
        </Box>
      )}
    </Box>
  );
}
