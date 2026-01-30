import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { HorizontalStepper } from './horizontal-stepper';

const meta: Meta<typeof HorizontalStepper> = {
  title: 'Navigation/Horizontal Stepper',
  component: HorizontalStepper,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HorizontalStepper>;

const basicSteps = [
  'Account Setup',
  'Profile Information',
  'Verification',
  'Complete',
];
const checkoutSteps = ['Cart', 'Shipping', 'Payment', 'Confirmation'];
const workflowSteps = ['Draft', 'Review', 'Approval', 'Published'];

export const Default: Story = {
  render: () => {
    const [activeStep, setActiveStep] = useState(1);
    const steps = [
      {
        id: 'business-type',
        label: 'Business type',
        description: 'Support text',
      },
      {
        id: 'business-details',
        label: 'Business details',
        description: 'Support text',
      },
      {
        id: 'personal-details',
        label: 'Personal details',
        description: 'Support text',
      },
      { id: 'payment', label: 'Payment', description: 'Support text' },
    ];

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
        <Card sx={{ width: '75%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Small Size</Typography>
            <HorizontalStepper
              steps={steps}
              activeStep={activeStep}
              variant="numbered"
              size="small"
              showButtons
              onNext={() =>
                setActiveStep(Math.min(steps.length - 1, activeStep + 1))
              }
              onBack={() => setActiveStep(Math.max(0, activeStep - 1))}
            />
          </CardContent>
        </Card>
        
        <Card sx={{ width: '75%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Medium Size (Default)</Typography>
            <HorizontalStepper
              steps={steps}
              activeStep={activeStep}
              variant="numbered"
              size="medium"
              showButtons
              onNext={() =>
                setActiveStep(Math.min(steps.length - 1, activeStep + 1))
              }
              onBack={() => setActiveStep(Math.max(0, activeStep - 1))}
            />
          </CardContent>
        </Card>
        
        <Card sx={{ width: '75%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Large Size</Typography>
            <HorizontalStepper
              steps={steps}
              activeStep={activeStep}
              variant="numbered"
              size="large"
              showButtons
              onNext={() =>
                setActiveStep(Math.min(steps.length - 1, activeStep + 1))
              }
              onBack={() => setActiveStep(Math.max(0, activeStep - 1))}
            />
          </CardContent>
        </Card>
      </Box>
    );
  },
};

export const GradientIconVariant: Story = {
  render: () => {
    const [activeStep, setActiveStep] = useState(1);
    const steps = [
      {
        id: 'business-type',
        label: 'Business type',
        description: 'Support text',
        icon: 'solar:buildings-bold-duotone',
      },
      {
        id: 'business-details',
        label: 'Business details',
        description: 'Support text',
        icon: 'solar:file-text-bold-duotone',
      },
      {
        id: 'personal-details',
        label: 'Personal details',
        description: 'Support text',
        icon: 'solar:user-bold-duotone',
      },
      {
        id: 'payment',
        label: 'Payment',
        description: 'Support text',
        icon: 'solar:card-bold-duotone',
      },
    ];

    return (
      <Card sx={{ width: '75%' }}>
        <CardContent>
          <HorizontalStepper
            steps={steps}
            activeStep={activeStep}
            variant="icon"
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="#667eea"
            showButtons
            onNext={() =>
              setActiveStep(Math.min(steps.length - 1, activeStep + 1))
            }
            onBack={() => setActiveStep(Math.max(0, activeStep - 1))}
          />
        </CardContent>
      </Card>
    );
  },
};

export const IconVariant: Story = {
  render: () => {
    const [activeStep, setActiveStep] = useState(1);
    const steps = [
      {
        id: 'business-type',
        label: 'Business type',
        description: 'Support text',
        icon: 'solar:buildings-bold-duotone',
      },
      {
        id: 'business-details',
        label: 'Business details',
        description: 'Support text',
        icon: 'solar:file-text-bold-duotone',
      },
      {
        id: 'personal-details',
        label: 'Personal details',
        description: 'Support text',
        icon: 'solar:user-bold-duotone',
      },
      {
        id: 'payment',
        label: 'Payment',
        description: 'Support text',
        icon: 'solar:card-bold-duotone',
      },
    ];

    return (
      <Card sx={{ width: '75%' }}>
        <CardContent>
          <HorizontalStepper
            steps={steps}
            activeStep={activeStep}
            variant="icon"
            showButtons
            onNext={() =>
              setActiveStep(Math.min(steps.length - 1, activeStep + 1))
            }
            onBack={() => setActiveStep(Math.max(0, activeStep - 1))}
          />
        </CardContent>
      </Card>
    );
  },
};

// export const ArrowVariant: Story = {
//   render: () => {
//     const [activeStep, setActiveStep] = useState(0);
//     const arrowSteps = ['Business type', 'Business Detail', 'Your details', 'Verification'];

//     return (
//       <Card sx={{ width: '75%' }}>
//         <CardContent>
//           <HorizontalStepper
//             steps={arrowSteps}
//             activeStep={activeStep}
//             variant="arrow"
//             stepDescriptions={['Supporting text', 'Supporting text', 'Supporting text', 'Supporting text']}
//             showButtons
//             onNext={() => setActiveStep(Math.min(arrowSteps.length - 1, activeStep + 1))}
//             onBack={() => setActiveStep(Math.max(0, activeStep - 1))}
//           />
//         </CardContent>
//       </Card>
//     );
//   },
// };
