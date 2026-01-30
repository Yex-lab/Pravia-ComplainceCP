import { useState, useEffect } from 'react';
import { safeReturnUrl } from 'minimal-shared/utils';
import { SplashScreen, useSearchParams } from '@asyml8/ui';

import { useAuthContext } from 'src/hooks/use-auth-context';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const { loading, authenticated } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);

  const searchParams = useSearchParams();
  const redirectUrl = safeReturnUrl(searchParams.get('returnTo'), CONFIG.auth.redirectPath);

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    if (CONFIG.auth.skip) {
      setIsChecking(false);
      return;
    }

    if (authenticated) {
      // Redirect authenticated users to the returnTo path
      // Using `window.location.href` instead of `router.replace` to avoid unnecessary re-rendering
      // that might be caused by the AuthGuard component
      window.location.href = redirectUrl;
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
