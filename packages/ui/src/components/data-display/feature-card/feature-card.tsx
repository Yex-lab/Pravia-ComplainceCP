import type { ReactNode } from 'react';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from '../iconify';

export type FeatureItem = {
  icon: string;
  iconBgColor: string;
  title: string;
  description: string;
};

export type FeatureCardProps = {
  headerIcon: ReactNode;
  headerIconBgColor?: string;
  title: string;
  subtitle: string;
  items: FeatureItem[];
  button?: ReactNode;
  animated?: boolean;
  animationType?: 'fade' | 'slide' | 'staggered-text' | 'staggered-letters';
  reanimateOnMount?: boolean;
  sx?: object;
};

export function FeatureCard({
  headerIcon,
  headerIconBgColor = 'primary.dark',
  title,
  subtitle,
  items,
  button,
  animated = false,
  animationType = 'staggered-letters',
  reanimateOnMount = true,
  sx,
}: FeatureCardProps) {
  const getAnimationVariants = () => {
    if (animationType === 'slide') {
      return {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      };
    }
    if (animationType === 'staggered-text') {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    }
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  };

  const variants = getAnimationVariants();

  return (
    <Box
      sx={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 4,
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box sx={{ p: 4, pb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              bgcolor: headerIconBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: 'primary.light',
            }}
          >
            {headerIcon}
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ borderTop: '1px solid', borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      <Box sx={{ p: 4, pt: 2 }}>
        <Stack spacing={3}>
          {items.map((item, index) => {
            const content = (
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    bgcolor: item.iconBgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Iconify icon={item.icon as any} width={28} sx={{ color: 'white' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  {animationType === 'staggered-text' && animated ? (
                    <>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: 700, mb: 0.5, fontSize: '1rem' }}
                      >
                        {item.title.split(' ').map((word, wordIndex) => (
                          <m.span
                            key={wordIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.15 + 0.2 + wordIndex * 0.1,
                            }}
                            style={{ display: 'inline-block', marginRight: '0.25em' }}
                          >
                            {word}
                          </m.span>
                        ))}
                      </Typography>
                      <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.15 + 0.2 + item.title.split(' ').length * 0.1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.875rem' }}
                        >
                          {item.description}
                        </Typography>
                      </m.div>
                    </>
                  ) : animationType === 'staggered-letters' && animated ? (
                    <>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: 700, mb: 0.5, fontSize: '1rem' }}
                      >
                        {item.title.split('').map((char, charIndex) => (
                          <m.span
                            key={charIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.15 + 0.2 + charIndex * 0.03,
                            }}
                            style={{ display: 'inline-block' }}
                          >
                            {char === ' ' ? '\u00A0' : char}
                          </m.span>
                        ))}
                      </Typography>
                      <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.15 + 0.2 + item.title.length * 0.03 + 0.1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.875rem' }}
                        >
                          {item.description}
                        </Typography>
                      </m.div>
                    </>
                  ) : (
                    <>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1rem' }}>
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.875rem' }}
                      >
                        {item.description}
                      </Typography>
                    </>
                  )}
                </Box>
              </Stack>
            );

            if (animated) {
              return (
                <m.div
                  key={index}
                  initial={reanimateOnMount ? 'hidden' : 'visible'}
                  animate="visible"
                  variants={variants}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                >
                  {content}
                </m.div>
              );
            }

            return <Box key={index}>{content}</Box>;
          })}
        </Stack>

        {button && (
          <Box sx={{ borderTop: '1px solid', borderColor: 'rgba(255, 255, 255, 0.1)', pt: 2, mt: 2 }}>
            {button}
          </Box>
        )}
      </Box>
    </Box>
  );
}
