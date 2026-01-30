import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { paths } from 'src/routes/paths';

import { useAppStore } from 'src/store/app.store';

type PublicStartupGuardProps = {
  children: React.ReactNode;
};

export function PublicStartupGuard({ children }: PublicStartupGuardProps) {
  const isPublicStartupComplete = useAppStore((state) => state.isPublicStartupComplete);
  const setTargetRedirectPath = useAppStore((state) => state.setTargetRedirectPath);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPublicStartupComplete) {
      // Store the current path as the target redirect
      setTargetRedirectPath(location.pathname);
      navigate(paths.startup.publicStartup, { replace: true });
    }
  }, [isPublicStartupComplete, navigate, location.pathname, setTargetRedirectPath]);

  if (!isPublicStartupComplete) {
    return null;
  }

  return <>{children}</>;
}
