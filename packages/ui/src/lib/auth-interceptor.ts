import type { InternalAxiosRequestConfig } from 'axios';

export function createAuthInterceptor(getToken: () => Promise<string | null>) {
  return async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to get auth token:', error);
    }
    return config;
  };
}
