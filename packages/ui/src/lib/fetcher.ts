import type { AxiosInstance, AxiosRequestConfig } from 'axios';

export function createFetcher(axiosInstance: AxiosInstance) {
  return async <T = unknown>(
    args: string | [string, AxiosRequestConfig]
  ): Promise<T> => {
    try {
      const [url, config] = Array.isArray(args) ? args : [args, {}];
      const res = await axiosInstance.get<T>(url, config);
      return res.data;
    } catch (error) {
      console.error('Fetcher failed:', error);
      throw error;
    }
  };
}
