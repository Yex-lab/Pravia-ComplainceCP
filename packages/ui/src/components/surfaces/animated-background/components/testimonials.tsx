'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';

import { TestimonialHoverCard, SimpleScrollReveal } from '../../../utils/animations';

// ----------------------------------------------------------------------

interface TestimonialData {
  name: string;
  role: string;
  review: string;
  rating: number;
}

// ----------------------------------------------------------------------

export function Testimonials({
  title = "Faster POCs. Faster Impact.",
  subtitle = "Organizations trust Asyml8 to move from idea to near-production AI in weeks—without sacrificing quality or compliance.",
  testimonials
}: {
  title?: string;
  subtitle?: string;
  testimonials: TestimonialData[];
}) {
  const { mode } = useColorScheme() || { mode: 'light' };

  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <SimpleScrollReveal direction="up" duration={600}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
                {title}
              </Typography>
              <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
                {subtitle}
              </Typography>
            </Box>
          </SimpleScrollReveal>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            sx={{ justifyContent: 'center' }}
          >
            {testimonials.map((testimonial, index) => (
              <SimpleScrollReveal 
                key={testimonial.name}
                direction="up" 
                delay={index * 200}
                duration={800}
                distance={50}
              >
                <TestimonialHoverCard>
                  <Card
                    sx={{
                      p: 4,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      background: mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.02)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.08)',
                      borderRadius: 3,
                    }}
                  >
                    <Rating value={testimonial.rating} readOnly size="small" sx={{ mb: 2 }} />
                    <Typography
                      variant="body1"
                      sx={{ mb: 3, flexGrow: 1, fontStyle: 'italic', color: 'text.secondary' }}
                    >
                      &ldquo;{testimonial.review}&rdquo;
                    </Typography>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Card>
                </TestimonialHoverCard>
              </SimpleScrollReveal>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
