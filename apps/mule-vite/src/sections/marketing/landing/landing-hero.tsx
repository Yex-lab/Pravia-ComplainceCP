import { ICONS, Iconify, useRouter, CtaLiquidButton } from '@asyml8/ui';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales/use-locales';

export function LandingHero() {
  const router = useRouter();
  const { t } = useTranslate('common');

  return (
    <Stack spacing={4} sx={{ flex: 1, position: 'relative' }}>
      <Box>
        <Typography
          variant="overline"
          sx={{ color: 'primary.main', letterSpacing: 2, fontSize: '0.875rem' }}
        >
          {t('landing.hero.overline')}
        </Typography>
      </Box>

      <Box sx={{ position: 'relative' }}>
        <Stack spacing={0}>
          <Box
            component="span"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 900,
              lineHeight: 1.1,
              background: 'linear-gradient(90deg, #4DA6DE 0%, #F4791F 50%, #4DA6DE 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient 3s linear infinite',
              '@keyframes gradient': {
                '0%': { backgroundPosition: '0% center' },
                '100%': { backgroundPosition: '200% center' },
              },
            }}
          >
            {t('landing.hero.title.ois')}
          </Box>
          <Typography
            variant="h1"
            component="div"
            sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 900, lineHeight: 1.1 }}
          >
            {t('landing.hero.title.portal')}
          </Typography>
        </Stack>
      </Box>

      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          fontSize: { xs: '1rem', md: '1.125rem' },
          lineHeight: 1.7,
        }}
      >
        {t('landing.hero.subtitle')}
      </Typography>

      <Stack direction="row" spacing={2}>
        <CtaLiquidButton
          startIcon={<Iconify icon={ICONS.USER_PLUS} />}
          onClick={() => router.push(paths.register.requestOrganizationAccess)}
          sx={{ px: 4, py: 1.5, borderRadius: '12px' }}
        >
          Request Access
        </CtaLiquidButton>
        <Button
          variant="outlined"
          startIcon={<Iconify icon={ICONS.ARROW_FORWARD} />}
          onClick={() => router.push(paths.auth.signIn)}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: '12px',
            borderColor: 'primary.main',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'primary.main',
              background: 'rgba(77, 166, 222, 0.1)',
            },
          }}
        >
          {t('auth.signIn.title')}
        </Button>
      </Stack>
    </Stack>
  );
}
