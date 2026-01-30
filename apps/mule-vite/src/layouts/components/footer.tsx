import { Logo, RouterLink } from '@asyml8/ui';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'src/hooks/use-translation';

// ----------------------------------------------------------------------

export function Footer() {
  const theme = useTheme();
  const { t } = useTranslation();

  const LINKS = [
    {
      headline: t('footer.support.title'),
      children: [{ name: t('footer.support.documentation'), href: '/docs' }],
    },
    {
      headline: t('footer.legal.title'),
      children: [
        { name: t('footer.legal.privacyPolicy'), href: '/privacy' },
        { name: t('footer.legal.termsOfService'), href: '/terms' },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 5,
        borderTop: `1px dashed ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={5}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 5, md: 0 }}
            justifyContent="space-between"
          >
            <Stack spacing={1} sx={{ maxWidth: 600 }}>
              <Stack direction="row" spacing={3} sx={{ alignItems: 'flex-start' }}>
                <Logo />
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    {t('footer.description')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {t('footer.copyright', { year: new Date().getFullYear() })}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gap: 5,
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              {LINKS.map((list) => (
                <Stack key={list.headline} spacing={2}>
                  <Typography variant="h6">{list.headline}</Typography>
                  <Stack spacing={1}>
                    {list.children.map((link) => (
                      <Link
                        key={link.name}
                        component={RouterLink}
                        href={link.href}
                        color="text.secondary"
                        variant="body2"
                        sx={{
                          '&:hover': {
                            color: 'text.primary',
                          },
                        }}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
