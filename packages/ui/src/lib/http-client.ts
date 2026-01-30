import axios, { type AxiosResponse } from 'axios';
import { createAuthInterceptor } from './auth-interceptor';
import { parseApiError } from './response-wrapper';

export interface HttpClientConfig {
  baseURL: string;
  getAuthToken?: () => Promise<string | null>;
  onError?: (error: Error) => void;
}

export function createHttpClient(config: HttpClientConfig) {
  const { baseURL, getAuthToken, onError } = config;
  
  const instance = axios.create({ baseURL });
  
  // Add auth interceptor if token getter provided
  if (getAuthToken) {
    instance.interceptors.request.use(createAuthInterceptor(getAuthToken));
  }
  
  // Add response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: any) => {
      const enhancedError = parseApiError(error);
      
      // Call custom error handler if provided
      if (onError) {
        onError(enhancedError);
      }
      
      return Promise.reject(enhancedError);
    }
  );
  
  return instance;
}
