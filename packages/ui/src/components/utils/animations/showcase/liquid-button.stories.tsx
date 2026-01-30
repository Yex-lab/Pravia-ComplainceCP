import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { Iconify } from '../../../data-display/iconify';
import { CtaLiquidButton } from '../effects/liquid-effects';

const meta: Meta<typeof CtaLiquidButton> = {
  title: 'Animations/Liquid Button',
  component: CtaLiquidButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Liquid Button

An engaging button component with liquid morphing effects on hover. Built with Framer Motion for smooth animations.

## Features

- Smooth liquid morphing animation on hover
- Support for icons (start and end positions)
- Customizable colors and sizes
- Accessible with proper focus states
- Respects reduced motion preferences

## Usage

\`\`\`tsx
import { CtaLiquidButton } from '@asyml8/ui';

// Basic usage
<CtaLiquidButton>Click me</CtaLiquidButton>

// With icon
<CtaLiquidButton startIcon={<Icon />}>
  Get Started
</CtaLiquidButton>

// With click handler
<CtaLiquidButton onClick={() => console.log('clicked')}>
  Action Button
</CtaLiquidButton>
\`\`\`

## Animation Details

The button uses a morphing blob effect that:
- Scales and transforms on hover
- Uses GPU-accelerated transforms for performance
- Includes subtle color transitions
- Maintains accessibility standards
        `,
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Button content',
    },
    startIcon: {
      control: false,
      description: 'Icon to display at the start of the button',
    },
    endIcon: {
      control: false,
      description: 'Icon to display at the end of the button',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CtaLiquidButton>;

export const Default: Story = {
  args: {
    children: 'Liquid Button',
  },
  parameters: {
    docs: {
      source: {
        code: '<CtaLiquidButton>Liquid Button</CtaLiquidButton>',
      },
    },
  },
};

export const WithStartIcon: Story = {
  args: {
    children: 'Get Started',
    startIcon: <Iconify icon="solar:arrow-right-bold" width={20} />,
  },
  parameters: {
    docs: {
      source: {
        code: `
<CtaLiquidButton startIcon={<Iconify icon="solar:arrow-right-bold" width={20} />}>
  Get Started
</CtaLiquidButton>
        `,
      },
    },
  },
};

export const WithEndIcon: Story = {
  args: {
    children: 'Learn More',
    endIcon: <Iconify icon="solar:arrow-right-bold" width={20} />,
  },
  parameters: {
    docs: {
      source: {
        code: `
<CtaLiquidButton endIcon={<Iconify icon="solar:arrow-right-bold" width={20} />}>
  Learn More
</CtaLiquidButton>
        `,
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack spacing={3} alignItems="center">
      <CtaLiquidButton size="small">Small Button</CtaLiquidButton>
      <CtaLiquidButton size="medium">Medium Button</CtaLiquidButton>
      <CtaLiquidButton size="large">Large Button</CtaLiquidButton>
    </Stack>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Stack spacing={3}>
  <CtaLiquidButton size="small">Small Button</CtaLiquidButton>
  <CtaLiquidButton size="medium">Medium Button</CtaLiquidButton>
  <CtaLiquidButton size="large">Large Button</CtaLiquidButton>
</Stack>
        `,
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Stack spacing={3} alignItems="center">
      <CtaLiquidButton>Default</CtaLiquidButton>
      <CtaLiquidButton startIcon={<Iconify icon="solar:eye-bold" width={20} />}>
        With Icon
      </CtaLiquidButton>
      <CtaLiquidButton 
        startIcon={<Iconify icon="solar:download-bold" width={20} />}
        endIcon={<Iconify icon="solar:arrow-right-bold" width={16} />}
      >
        Both Icons
      </CtaLiquidButton>
      <CtaLiquidButton disabled>
        Disabled
      </CtaLiquidButton>
    </Stack>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Stack spacing={3}>
  <CtaLiquidButton>Default</CtaLiquidButton>
  
  <CtaLiquidButton startIcon={<Iconify icon="solar:eye-bold" width={20} />}>
    With Icon
  </CtaLiquidButton>
  
  <CtaLiquidButton 
    startIcon={<Iconify icon="solar:download-bold" width={20} />}
    endIcon={<Iconify icon="solar:arrow-right-bold" width={16} />}
  >
    Both Icons
  </CtaLiquidButton>
  
  <CtaLiquidButton disabled>
    Disabled
  </CtaLiquidButton>
</Stack>
        `,
      },
    },
  },
};

export const InContext: Story = {
  render: () => (
    <Container maxWidth="md">
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 2,
        color: 'white'
      }}>
        <Typography variant="h3" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Join thousands of users who love our platform
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <CtaLiquidButton 
            size="large"
            startIcon={<Iconify icon="solar:rocket-bold" width={24} />}
          >
            Start Free Trial
          </CtaLiquidButton>
          <CtaLiquidButton 
            size="large"
            endIcon={<Iconify icon="solar:arrow-right-bold" width={20} />}
          >
            Learn More
          </CtaLiquidButton>
        </Stack>
      </Box>
    </Container>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        code: `
<Container maxWidth="md">
  <Box sx={{ 
    textAlign: 'center', 
    py: 8,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 2,
    color: 'white'
  }}>
    <Typography variant="h3" gutterBottom>
      Ready to Get Started?
    </Typography>
    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
      Join thousands of users who love our platform
    </Typography>
    <Stack direction="row" spacing={2} justifyContent="center">
      <CtaLiquidButton 
        size="large"
        startIcon={<Iconify icon="solar:rocket-bold" width={24} />}
      >
        Start Free Trial
      </CtaLiquidButton>
      <CtaLiquidButton 
        size="large"
        endIcon={<Iconify icon="solar:arrow-right-bold" width={20} />}
      >
        Learn More
      </CtaLiquidButton>
    </Stack>
  </Box>
</Container>
        `,
      },
    },
  },
};
