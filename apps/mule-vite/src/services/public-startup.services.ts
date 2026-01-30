import type { QueryClient } from '@tanstack/react-query';

import i18n from 'src/lib/i18n';
import { fluxServices } from 'src/api/flux.api';
import { QUERY_KEYS, STALE_TIMES, SERVICE_NAMES } from 'src/constants';

import { useAppStore } from '../store/app.store';

export interface PublicServiceConfig {
  name: string;
  fn: () => Promise<any>;
  setter: (data: any) => void;
  critical: boolean;
  message: string;
}

export const getPublicServiceConfigs = (queryClient: QueryClient): PublicServiceConfig[] => {
  const store = useAppStore.getState();

  return [
    {
      name: SERVICE_NAMES.PUBLIC_ACCOUNTS,
      fn: () =>
        queryClient.fetchQuery({
          queryKey: QUERY_KEYS.PUBLIC_ACCOUNTS,
          queryFn: () => fluxServices.public.getPublicAccounts(),
          staleTime: STALE_TIMES.PUBLIC_ACCOUNTS,
        }),
      setter: (data) => {
        store.slices.accountsPublic.setData(data);
      },
      critical: true,
      message: i18n.t('startup.retrievingOrganizations', { ns: 'common' }),
    },
  ];
};
