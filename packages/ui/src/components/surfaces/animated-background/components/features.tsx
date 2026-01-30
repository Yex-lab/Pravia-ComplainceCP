'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';

import { Iconify } from '../../../data-display/iconify';
import { SubtleParticles, FeatureGlassCard, FeatureMorphingIcon } from '../../../utils/animations';
import { FeatureHoverCard } from '../../../utils/animations';
import { FeatureIcon } from '../../../utils/animations';
import { SimpleScrollReveal } from '../../../utils/animations';
import { StaggeredText } from '../../../utils/animations';

// ----------------------------------------------------------------------

interface FeatureData {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
}

// ----------------------------------------------------------------------

export function Features({
  title = "From POC to Production—Faster",
  subtitle = "Our platform and process are built to eliminate bottlenecks, compress timelines, and deliver AI that's ready to scale.",
  features
}: {
  title?: string;
  subtitle?: string;
  features: FeatureData[];
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
      <SubtleParticles />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={6}>
          <SimpleScrollReveal direction="up" duration={600}>
            <Box sx={{ textAlign: 'center' }}>
              <StaggeredText
                text={title}
                variant="h2"
                animationUnit="letter"
                staggerDelay={0.05}
                sx={{ fontWeight: 700, mb: 2 }}
              />
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
            {features.map((feature, index) => (
              <SimpleScrollReveal 
                key={feature.title}
                direction="up"
                delay={index * 200}
                duration={800}
                distance={50}
              >
                <FeatureHoverCard>
                  <FeatureGlassCard>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                        borderRadius: '50%',
                        background: (theme) => mode === 'dark'
                          ? `linear-gradient(135deg, ${theme.palette.primary.dark}44, ${theme.palette.secondary.dark}33)`
                          : `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <FeatureMorphingIcon
                        sx={{
                          position: 'absolute',
                          zIndex: 0,
                          opacity: 0.2,
                        }}
                      />
                      
                      <FeatureIcon
                        icon={
                          <Iconify 
                            icon={feature.icon as any} 
                            width={40} 
                            sx={{ 
                              color: 'primary.main',
                            }} 
                          />
                        }
                        animationType="bounce"
                        delay={index * 0.2}
                        sx={{
                          position: 'relative',
                          zIndex: 1,
                          background: 'transparent',
                          border: 'none',
                          width: 40,
                          height: 40,
                        }}
                      />
                    </Box>
                    
                    <Box>
                      <StaggeredText
                        text={feature.title}
                        variant="h5"
                        animationUnit="letter"
                        staggerDelay={0.03}
                        sx={{ mb: 1, fontWeight: 600 }}
                      />
                      
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          mb: 2, 
                          fontWeight: 600,
                          color: 'primary.main',
                        }}
                      >
                        {feature.subtitle}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {feature.description}
                      </Typography>
                    </Box>
                  </FeatureGlassCard>
                </FeatureHoverCard>
              </SimpleScrollReveal>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
