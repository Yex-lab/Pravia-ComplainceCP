import { RouterLink } from '@asyml8/ui';
import {
  BrandLogo,
  HeroParticles,
  SettingsButton,
  HeroMorphingShape,
  StandardNeuralNetwork,
  BackgroundMorphingElement,
  AnimatedLayout as UIAnimatedLayout,
  type AnimatedLayoutProps as UIAnimatedLayoutProps,
} from '@asyml8/ui';

import Box from '@mui/material/Box';

import { LanguagePopover } from './components/language-popover';

// ----------------------------------------------------------------------

interface AnimatedLayoutProps extends Omit<UIAnimatedLayoutProps, 'logo' | 'headerActions'> {
  children: React.ReactNode;
}

export function AnimatedLayout({ children, ...other }: AnimatedLayoutProps) {
  return (
    <UIAnimatedLayout
      logo={<BrandLogo LinkComponent={RouterLink} isSingle={false} />}
      headerActions={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          <LanguagePopover
            data={[
              { value: 'en', label: 'English', countryCode: 'US' },
              { value: 'es', label: 'Español', countryCode: 'ES' },
            ]}
          />
          <SettingsButton />
        </Box>
      }
      backgroundAnimations={
        <>
          <StandardNeuralNetwork
            sx={{
              width: '100%',
              height: '100%',
              opacity: 0.3,
              mixBlendMode: 'screen',
            }}
          />
          <HeroParticles />
          <HeroMorphingShape
            sx={{
              position: 'absolute',
              top: '20%',
              right: '10%',
            }}
          />
          <BackgroundMorphingElement
            sx={{
              position: 'absolute',
              top: '20%',
              right: '50%',
            }}
          />
          <BackgroundMorphingElement
            sx={{
              position: 'absolute',
              top: '50%',
              left: '10%',
            }}
          />
        </>
      }
      {...other}
    >
      {children}
    </UIAnimatedLayout>
  );
}
