import type { ReactNode } from 'react';

import { HorizontalStepper } from '@asyml8/ui';
import { Children, isValidElement } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

type Step = {
  label: string;
  icon?: string;
};

type CustomStepperFormProps = {
  title: string;
  subtitle: ReactNode;
  steps: Step[];
  activeStep: number;
  showContent: boolean;
  stepDescription?: ReactNode;
  children: ReactNode;
  showStepper?: boolean;
  cardMaxWidth?: number;
  contentMaxWidth?: number;
};

export function CustomStepperForm({
  title,
  subtitle,
  steps,
  activeStep,
  showContent,
  stepDescription,
  children,
  showStepper = true,
  cardMaxWidth = 700,
  contentMaxWidth = 550,
}: CustomStepperFormProps) {
  // Flatten fragment children and split - last child is FormActions
  let childArray = Children.toArray(children);

  // If children is a single fragment, extract its children
  if (
    childArray.length === 1 &&
    isValidElement(childArray[0]) &&
    (childArray[0] as any).type === Symbol.for('react.fragment')
  ) {
    childArray = Children.toArray((childArray[0] as any).props.children);
  }

  const formActions = childArray[childArray.length - 1];
  const formContent = childArray.slice(0, -1);

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        pt: 2,
      }}
    >
      <Card sx={{ maxWidth: cardMaxWidth, width: 1, transition: 'max-width 0.3s' }}>
        <Stack spacing={3} sx={{ p: 3, pb: 3 }}>
          <Fade in={showContent} timeout={300}>
            <Stack spacing={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ mb: 1 }}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {subtitle}
                </Typography>
              </Box>

              <Divider sx={{ mx: -3 }} />

              {showStepper && steps.length > 0 && (
                <Box sx={{ pt: 1 }}>
                  <HorizontalStepper steps={steps} activeStep={activeStep} variant="icon" />
                </Box>
              )}

              {showStepper && steps.length > 0 && stepDescription && (
                <Typography component="div" variant="body2" color="text.secondary" sx={{ px: 3 }}>
                  {stepDescription}
                </Typography>
              )}

              <Box sx={{ pb: 0 }}>{formContent}</Box>

              {formActions}
            </Stack>
          </Fade>
        </Stack>
      </Card>
    </Box>
  );
}
