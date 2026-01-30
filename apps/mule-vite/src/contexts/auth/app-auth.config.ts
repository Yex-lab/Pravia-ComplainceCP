import type { AuthConfig } from '@asyml8/ui';

import { paths } from 'src/routes/paths';

import { authLogger } from 'src/utils/logger.util';

export const appAuthConfig: AuthConfig = {
  paths: {
    authCallback: paths.auth.callback,
    updatePassword: paths.auth.updatePassword,
  },
  logger: authLogger,
  onTokenChange: async (token: string | null) => {
    if (typeof window !== 'undefined') {
      const { default: axios } = await import('src/lib/axios');
      if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      } else {
        delete axios.defaults.headers.common.Authorization;
      }
    }
  },
};
