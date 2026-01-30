'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';

import { Iconify } from '../../../data-display/iconify';
import { BackgroundMorphingElement, CtaLiquidButton } from '../../../utils/animations';
import { AnimatedIcon } from '../../../utils/animations';
import { SimpleScrollReveal } from '../../../utils/animations';

// ----------------------------------------------------------------------

export function CTA({
  title = "Ready to Get Started?",
  subtitle = "Join thousands of companies transforming their business with AI",
  buttons = [
    { text: "Start Free Trial", icon: "carbon:rocket" },
    { text: "Contact Sales", icon: "solar:phone-bold" }
  ],
  features = [
    { icon: 'solar:shield-check-bold', text: 'No credit card required' },
    { icon: 'solar:clock-circle-bold', text: '14-day free trial' },
    { icon: 'eva:checkmark-fill', text: 'Cancel anytime' },
  ]
}: {
  title?: string;
  subtitle?: string;
  buttons?: Array<{ text: string; icon?: string }>;
  features?: Array<{ icon: string; text: string }>;
}) {
  const { mode } = useColorScheme() || { mode: 'light' };

  return (
    <Box 
      sx={{ 
        py: 10, 
        bgcolor: mode === 'dark' ? '#0a0a0a' : 'background.neutral',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BackgroundMorphingElement />
      <BackgroundMorphingElement />
      
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <SimpleScrollReveal direction="up" duration={800}>
          <Stack spacing={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
            
            <SimpleScrollReveal direction="up" delay={300} duration={600}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
                {buttons.map((button, index) => (
                  <CtaLiquidButton
                    key={index}
                    startIcon={button.icon ? <Iconify icon={button.icon as any} width={24} /> : undefined}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    {button.text}
                  </CtaLiquidButton>
                ))}
              </Stack>
            </SimpleScrollReveal>

            <SimpleScrollReveal direction="fade" delay={600} duration={600}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                sx={{ justifyContent: 'center', mt: 4 }}
              >
                {features.map((item, index) => (
                  <Stack key={item.text} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <AnimatedIcon
                      animationType="scale"
                      delay={index * 0.1}
                      size={20}
                      sx={{ 
                        background: 'transparent', 
                        border: 'none',
                        width: 20,
                        height: 20,
                      }}
                    >
                      <Iconify icon={item.icon as any} width={20} sx={{ color: 'success.main' }} />
                    </AnimatedIcon>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {item.text}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </SimpleScrollReveal>
          </Stack>
        </SimpleScrollReveal>
      </Container>
    </Box>
  );
}
