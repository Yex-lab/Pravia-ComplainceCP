import { useState, useEffect } from 'react';
import { useRouter, SplashScreen } from '@asyml8/ui';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/hooks/use-auth-context';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const { authenticated, loading } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    if (CONFIG.auth.skip) {
      setIsChecking(false);
      return;
    }

    if (!authenticated) {
      router.replace(paths.auth.signIn);
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
