import type { AxiosInstance, AxiosRequestConfig } from 'axios';

interface ApiResponse<T> {
  body: T;
}

export const createHttpHelpers = (axios: AxiosInstance) => ({
  get: async <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.get<ApiResponse<T>>(url, { params, ...config });
    return response.data.body;
  },

  list: async <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T[]> => {
    const response = await axios.get<ApiResponse<T[]>>(url, { params, ...config });
    return response.data.body || [];
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.post<ApiResponse<T>>(url, data, config);
    return response.data.body;
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.put<ApiResponse<T>>(url, data, config);
    return response.data.body;
  },

  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.patch<ApiResponse<T>>(url, data, config);
    return response.data.body;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.delete<ApiResponse<T>>(url, config);
    return response.data.body;
  },

  upload: async <T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: { 'Content-Type': 'multipart/form-data', ...config?.headers },
    });
    return response.data.body;
  },

  raw: async <T>(config: AxiosRequestConfig): Promise<T> => {
    const response = await axios.request<T>(config);
    return response.data;
  },
});
