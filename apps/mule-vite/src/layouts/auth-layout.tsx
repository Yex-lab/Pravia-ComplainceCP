import { RouterLink } from '@asyml8/ui';
import {
  BrandLogo,
  SettingsButton,
  HeroMorphingShape,
  StandardNeuralNetwork,
  BackgroundMorphingElement,
  AnimatedFormLayout as UIAnimatedFormLayout,
  type AnimatedFormLayoutProps as UIAnimatedFormLayoutProps,
} from '@asyml8/ui';

import Box from '@mui/material/Box';

import { LanguagePopover } from './components/language-popover';

// ----------------------------------------------------------------------

interface AnimatedFormLayoutProps extends Omit<
  UIAnimatedFormLayoutProps,
  'logo' | 'headerActions'
> {
  children: React.ReactNode;
}

export function AuthLayout({ children, ...other }: AnimatedFormLayoutProps) {
  return (
    <UIAnimatedFormLayout
      contentOffset="-40px"
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
      logo={<BrandLogo LinkComponent={RouterLink} isSingle={false} />}
      contentVariant="solid"
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
      headerBgOpacity={0.6}
      headerBgVisible
      gradientVariant="hero"
      gradientAnimated
      {...other}
    >
      {children}
    </UIAnimatedFormLayout>
  );
}
