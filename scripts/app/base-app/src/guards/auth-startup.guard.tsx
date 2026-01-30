import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { paths } from 'src/routes/paths';

import { useAppStore } from 'src/store/app.store';

type AuthStartupGuardProps = {
  children: React.ReactNode;
};

export function AuthStartupGuard({ children }: AuthStartupGuardProps) {
  const isAuthenticatedStartupComplete = useAppStore(
    (state) => state.isAuthenticatedStartupComplete
  );
  const location = useLocation();
  const navigate = useNavigate();

  // Allow auth routes and initialize route to bypass initialization check
  const isAuthRoute = location.pathname.startsWith('/auth');
  const isInitializeRoute =
    location.pathname === '/initialize' || location.pathname === paths.startup.initialize;

  useEffect(() => {
    if (!isAuthenticatedStartupComplete && !isAuthRoute && !isInitializeRoute) {
      // Only save dashboard/admin/workspace routes (logged-in routes)
      const isProtectedRoute =
        location.pathname.startsWith('/dashboard') ||
        location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/my-workspace');

      if (isProtectedRoute) {
        sessionStorage.setItem('returnRoute', location.pathname);
      }
      navigate(paths.startup.initialize, { replace: true });
    }
  }, [isAuthenticatedStartupComplete, isAuthRoute, isInitializeRoute, navigate, location.pathname]);

  if (!isAuthenticatedStartupComplete && !isAuthRoute && !isInitializeRoute) {
    return null;
  }

  return <>{children}</>;
}
