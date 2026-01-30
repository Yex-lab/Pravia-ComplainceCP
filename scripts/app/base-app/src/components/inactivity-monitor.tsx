import { useAuthContext } from 'src/hooks/use-auth-context';
import { useInactivityTimeout } from 'src/hooks/use-inactivity-timeout';

export function InactivityMonitor() {
  const { authenticated } = useAuthContext();

  useInactivityTimeout(authenticated);

  return null;
}
