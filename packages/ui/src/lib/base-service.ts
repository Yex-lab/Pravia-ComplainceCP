import type { AxiosInstance } from 'axios';

interface ApiResponse<T> {
  body: T;
}

export abstract class BaseService {
  protected axios: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axios = axiosInstance;
  }

  /** Get a single resource */
  protected async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.axios.get<ApiResponse<T>>(url, { params });
    return response.data.body;
  }

  /** Get a list of resources */
  protected async list<T>(url: string, params?: any): Promise<T[]> {
    const response = await this.axios.get<ApiResponse<T[]>>(url, { params });
    return response.data.body || [];
  }

  /** Create a new resource */
  protected async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.axios.post<ApiResponse<T>>(url, data);
    return response.data.body;
  }

  /** Update an existing resource */
  protected async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.axios.put<ApiResponse<T>>(url, data);
    return response.data.body;
  }

  /** Delete a resource */
  protected async delete<T>(url: string): Promise<T> {
    const response = await this.axios.delete<ApiResponse<T>>(url);
    return response.data.body;
  }
}
