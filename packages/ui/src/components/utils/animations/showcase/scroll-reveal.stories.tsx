import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import { Iconify } from '../../../data-display/iconify';
import { SimpleScrollReveal } from '../scroll/simple-scroll-reveal';
import { ScrollProgress } from '../scroll/scroll-progress/scroll-progress';

const meta: Meta<typeof SimpleScrollReveal> = {
  title: 'Animations/Scroll Reveal',
  component: SimpleScrollReveal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Scroll Reveal

A component that reveals content with smooth animations when scrolled into view. Uses Intersection Observer for performance.

## Features

- Multiple animation directions (up, left, fade)
- Intersection Observer for performance
- Customizable animation timing
- Respects reduced motion preferences
- Works with any child content

## Usage

\`\`\`tsx
import { SimpleScrollReveal } from '@asyml8/ui';

// Slide up animation
<SimpleScrollReveal direction="up">
  <Card>Your content</Card>
</SimpleScrollReveal>

// Slide from right
<SimpleScrollReveal direction="left">
  <Box>Content slides from right</Box>
</SimpleScrollReveal>

// Fade in animation
<SimpleScrollReveal direction="fade">
  <Typography>Fades in smoothly</Typography>
</SimpleScrollReveal>
\`\`\`

## Animation Types

- **up**: Slides up from bottom (most common)
- **left**: Slides in from right side
- **fade**: Simple fade in effect

## Performance

- Uses Intersection Observer API
- Animations only trigger when elements enter viewport
- GPU-accelerated transforms
- Minimal layout thrashing
        `,
      },
    },
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['up', 'left', 'fade'],
      description: 'Animation direction',
    },
    children: {
      control: false,
      description: 'Content to animate',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SimpleScrollReveal>;

export const Default: Story = {
  args: {
    direction: 'up',
    children: (
      <Card sx={{ p: 3, maxWidth: 400 }}>
        <Typography variant="h6" gutterBottom>
          Scroll Reveal Card
        </Typography>
        <Typography variant="body2">
          This card animates up when scrolled into view.
        </Typography>
      </Card>
    ),
  },
  parameters: {
    docs: {
      source: {
        code: `
<SimpleScrollReveal direction="up">
  <Card sx={{ p: 3 }}>
    <Typography variant="h6">Scroll Reveal Card</Typography>
    <Typography variant="body2">
      This card animates up when scrolled into view.
    </Typography>
  </Card>
</SimpleScrollReveal>
        `,
      },
    },
  },
};

export const Directions: Story = {
  render: () => (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Animation Directions
      </Typography>
      <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
        Scroll down to see different animation directions
      </Typography>
      
      <Stack spacing={6}>
        <SimpleScrollReveal direction="up">
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              ⬆️ Slide Up Animation
            </Typography>
            <Typography variant="body1">
              This card slides up from the bottom when it enters the viewport.
              It's the most common animation for revealing content.
            </Typography>
          </Card>
        </SimpleScrollReveal>

        <SimpleScrollReveal direction="left">
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              ⬅️ Slide Left Animation
            </Typography>
            <Typography variant="body1">
              This card slides in from the right side. Great for alternating
              content layouts or emphasizing horizontal movement.
            </Typography>
          </Card>
        </SimpleScrollReveal>

        <SimpleScrollReveal direction="fade">
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              ✨ Fade Animation
            </Typography>
            <Typography variant="body1">
              This card simply fades in without any directional movement.
              Perfect for subtle reveals and text content.
            </Typography>
          </Card>
        </SimpleScrollReveal>
      </Stack>
    </Container>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Stack spacing={6}>
  <SimpleScrollReveal direction="up">
    <Card sx={{ p: 4 }}>
      <Typography variant="h5">Slide Up Animation</Typography>
      <Typography>Slides up from bottom</Typography>
    </Card>
  </SimpleScrollReveal>

  <SimpleScrollReveal direction="left">
    <Card sx={{ p: 4 }}>
      <Typography variant="h5">Slide Left Animation</Typography>
      <Typography>Slides in from right</Typography>
    </Card>
  </SimpleScrollReveal>

  <SimpleScrollReveal direction="fade">
    <Card sx={{ p: 4 }}>
      <Typography variant="h5">Fade Animation</Typography>
      <Typography>Simple fade in effect</Typography>
    </Card>
  </SimpleScrollReveal>
</Stack>
        `,
      },
    },
  },
};

export const FeatureGrid: Story = {
  render: () => (
    <ScrollProgress showProgressBar progressHeight={3}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SimpleScrollReveal direction="fade">
          <Typography variant="h2" textAlign="center" gutterBottom>
            Our Features
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 8 }}>
            Discover what makes our platform special
          </Typography>
        </SimpleScrollReveal>

        <Grid container spacing={4}>
          {[
            { icon: 'solar:rocket-bold', title: 'Fast Performance', description: 'Lightning-fast animations with GPU acceleration' },
            { icon: 'solar:eye-bold', title: 'Beautiful Design', description: 'Carefully crafted animations that delight users' },
            { icon: 'solar:settings-bold', title: 'Customizable', description: 'Flexible configuration for any use case' },
            { icon: 'solar:shield-check-bold', title: 'Accessible', description: 'Built with accessibility and reduced motion in mind' },
            { icon: 'solar:code-bold', title: 'Developer Friendly', description: 'Simple API with TypeScript support' },
            { icon: 'solar:heart-bold', title: 'User Focused', description: 'Designed to enhance user experience' },
          ].map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <SimpleScrollReveal direction={index % 2 === 0 ? 'up' : 'left'}>
                <Card sx={{ 
                  p: 4, 
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Iconify 
                      icon={feature.icon} 
                      width={48} 
                      sx={{ color: 'primary.main', mb: 2 }} 
                    />
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Card>
              </SimpleScrollReveal>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <SimpleScrollReveal direction="fade">
            <Typography variant="h4" gutterBottom>
              Ready to get started?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Join thousands of developers using our animation components
            </Typography>
          </SimpleScrollReveal>
        </Box>
      </Container>
    </ScrollProgress>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<ScrollProgress showProgressBar progressHeight={3}>
  <Container maxWidth="lg" sx={{ py: 8 }}>
    <SimpleScrollReveal direction="fade">
      <Typography variant="h2" textAlign="center">
        Our Features
      </Typography>
    </SimpleScrollReveal>

    <Grid container spacing={4}>
      {features.map((feature, index) => (
        <Grid item xs={12} md={6} lg={4} key={index}>
          <SimpleScrollReveal direction={index % 2 === 0 ? 'up' : 'left'}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Iconify icon={feature.icon} width={48} />
                <Typography variant="h6">{feature.title}</Typography>
                <Typography variant="body2">{feature.description}</Typography>
              </Box>
            </Card>
          </SimpleScrollReveal>
        </Grid>
      ))}
    </Grid>
  </Container>
</ScrollProgress>
        `,
      },
    },
  },
};

export const LongScrollDemo: Story = {
  render: () => (
    <ScrollProgress showProgressBar progressHeight={4}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          Long Scroll Demo
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 8 }}>
          Scroll down to see multiple animations trigger as content comes into view
        </Typography>

        {Array.from({ length: 10 }, (_, i) => (
          <Box key={i} sx={{ mb: 6 }}>
            <SimpleScrollReveal direction={i % 3 === 0 ? 'up' : i % 3 === 1 ? 'left' : 'fade'}>
              <Card sx={{ p: 4 }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}>
                    {i + 1}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" gutterBottom>
                      Section {i + 1}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      This is section {i + 1} with a {
                        i % 3 === 0 ? 'slide up' : 
                        i % 3 === 1 ? 'slide left' : 'fade'
                      } animation. Each section animates independently as it enters the viewport.
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </SimpleScrollReveal>
          </Box>
        ))}

        <SimpleScrollReveal direction="fade">
          <Card sx={{ p: 6, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h4" gutterBottom>
              🎉 You made it to the end!
            </Typography>
            <Typography variant="body1">
              All animations are optimized for performance and accessibility.
            </Typography>
          </Card>
        </SimpleScrollReveal>
      </Container>
    </ScrollProgress>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<ScrollProgress showProgressBar progressHeight={4}>
  <Container maxWidth="md">
    {sections.map((section, i) => (
      <SimpleScrollReveal 
        key={i}
        direction={i % 3 === 0 ? 'up' : i % 3 === 1 ? 'left' : 'fade'}
      >
        <Card sx={{ p: 4, mb: 6 }}>
          <Typography variant="h5">Section {i + 1}</Typography>
          <Typography>Content for section {i + 1}</Typography>
        </Card>
      </SimpleScrollReveal>
    ))}
  </Container>
</ScrollProgress>
        `,
      },
    },
  },
};
