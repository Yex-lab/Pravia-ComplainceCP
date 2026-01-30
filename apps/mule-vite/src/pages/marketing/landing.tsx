import { useEffect } from 'react';
import { useRouter } from '@asyml8/ui';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { useAuthContext } from 'src/hooks/use-auth-context';

import { CONFIG } from 'src/global-config';
import { AnimatedLayout } from 'src/layouts/animated-layout';

import { LandingHero, LandingFeatures } from 'src/sections/marketing/landing';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    // Check if this is a password recovery redirect from Supabase
    const hash = window.location.hash.slice(1);
    if (hash) {
      const params = new URLSearchParams(hash);
      const type = params.get('type');

      if (type === 'recovery') {
        // Redirect to callback to handle the recovery tokens
        router.push(`/auth/callback${window.location.hash}`);
        return;
      }
    }

    if (!loading && user) {
      router.push(CONFIG.auth.redirectPath);
    }
  }, [router, user, loading]);

  if (loading) return null;
  if (user) return null;

  return (
    <AnimatedLayout headerBgOpacity={0.1}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="flex-start">
          <LandingHero />
          <LandingFeatures />
        </Stack>
      </Container>
    </AnimatedLayout>
  );
}
