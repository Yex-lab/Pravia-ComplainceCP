import { ApiManager, createHttpClient } from '@asyml8/ui';
import { createFluxSlices, createFluxServices } from '@asyml8/api-types';

import { supabase } from 'src/lib/supabase';

// Create API manager
const apiManager = new ApiManager(createHttpClient);

// Create Flux API instance
export const fluxApi = apiManager.createInstance('fluxApi', {
  baseURL: import.meta.env.VITE_DATA_API_URL ?? 'http://localhost:4001',
  getAuthToken: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  },
});

// Create Flux API services and slices
export const fluxServices = createFluxServices({ axios: fluxApi, basePath: '' });
export const fluxSlices = createFluxSlices(fluxServices);
