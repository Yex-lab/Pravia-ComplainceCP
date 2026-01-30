import { useEffect } from 'react';
import { useRouter, AnimateLogoZoom } from '@asyml8/ui';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { authLogger } from 'src/utils/logger.util';

import { useTranslate } from 'src/locales';
import { supabase } from 'src/lib/supabase';
import { useAppStore } from 'src/store/app.store';
import { AnimatedLayout } from 'src/layouts/animated-layout';

import { AppLogo } from 'src/components/app-logo';

export default function AuthCallback() {
  const router = useRouter();
  const { t } = useTranslate('common');
  const invitePending = useAppStore((state) => state.invitePending);
  const setInvitePending = useAppStore((state) => state.setInvitePending);

  useEffect(() => {
    authLogger.debug('[CALLBACK] Component mounted');

    // Set invite pending flag if there are tokens in the hash
    const hash = window.location.hash;
    authLogger.debug('[CALLBACK] Hash:', hash);

    // Check if this is a recovery flow
    if (hash && hash.includes('type=recovery')) {
      const params = new URLSearchParams(hash.slice(1));
      const access_token = params.get('access_token');

      if (access_token) {
        authLogger.info('[CALLBACK] Recovery flow detected, verifying token');

        // Use verifyOtp for recovery tokens
        supabase.auth
          .verifyOtp({
            token_hash: access_token,
            type: 'recovery',
          })
          .then(({ data, error }) => {
            if (error) {
              authLogger.error('[CALLBACK] Failed to verify recovery token:', error);
              router.push(paths.auth.signIn);
            } else {
              authLogger.info('[CALLBACK] Recovery token verified successfully');
              router.push(paths.auth.updatePassword);
            }
          });

        // Return cleanup function for recovery flow
        return () => {
          authLogger.debug('[CALLBACK] Component unmounting (recovery flow)');
        };
      }
    }

    if (hash && hash.includes('access_token')) {
      authLogger.info('[CALLBACK] Setting invitePending to true');
      setInvitePending(true);
    }

    let unsubscribe: (() => void) | undefined;
    let timeoutId: NodeJS.Timeout;

    const setupListener = async () => {
      authLogger.debug('[CALLBACK] Setting up auth state listener');

      // Listen for auth state changes
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        authLogger.info('[CALLBACK] Auth state changed:', event, 'Session exists:', !!session);

        if (session) {
          authLogger.info('[CALLBACK] Session found, redirecting to update-password');
          setInvitePending(false);
          router.push(paths.auth.updatePassword);
        }
      });

      unsubscribe = data.subscription.unsubscribe;

      // Fallback: if invite pending, always go to update-password
      // Otherwise go to sign-in
      timeoutId = setTimeout(() => {
        authLogger.warn('[CALLBACK] Fallback timeout fired, invitePending:', invitePending);

        if (invitePending) {
          authLogger.info('[CALLBACK] Redirecting to update-password (fallback)');
          router.push(paths.auth.updatePassword);
        } else {
          authLogger.info('[CALLBACK] Redirecting to sign-in (fallback)');
          router.push(paths.auth.signIn);
        }
      }, 5000);
    };

    setupListener();

    return () => {
      authLogger.debug('[CALLBACK] Component unmounting');
      unsubscribe?.();
      clearTimeout(timeoutId);
    };
  }, [router, invitePending, setInvitePending]);

  return (
    <AnimatedLayout headerBgOpacity={0.1}>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <AnimateLogoZoom logo={<AppLogo width={64} height={64} />} />
          <Typography variant="h6" sx={{ color: 'text.primary', mt: 4 }}>
            {t('auth.callback.processing')}
          </Typography>
        </Box>
      </Box>
    </AnimatedLayout>
  );
}
