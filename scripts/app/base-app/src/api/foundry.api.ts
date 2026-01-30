import { ApiManager, createHttpClient } from '@asyml8/ui';
import { createFoundrySlices, createFoundryServices } from '@asyml8/api-types';

import { supabase } from 'src/lib/supabase';

// Create API manager
const apiManager = new ApiManager(createHttpClient);

// Create Foundry API instance
export const foundryApi = apiManager.createInstance('foundryApi', {
  baseURL: import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:4000',
  getAuthToken: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  },
});

// Create Foundry API services and slices
export const foundryServices = createFoundryServices({ axios: foundryApi, basePath: '' });
export const foundrySlices = createFoundrySlices(foundryServices);
