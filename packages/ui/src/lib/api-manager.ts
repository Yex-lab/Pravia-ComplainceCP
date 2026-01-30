import type { AxiosInstance } from 'axios';

export interface ApiConfig {
  baseURL: string;
  getAuthToken?: () => Promise<string | null>;
  onError?: (error: any) => void;
  [key: string]: any;
}

export interface HttpClientFactory {
  (config: ApiConfig): AxiosInstance;
}

export class ApiManager {
  private instances = new Map<string, AxiosInstance>();
  private httpClientFactory: HttpClientFactory;

  constructor(httpClientFactory: HttpClientFactory) {
    this.httpClientFactory = httpClientFactory;
  }

  createInstance(name: string, config: ApiConfig): AxiosInstance {
    const instance = this.httpClientFactory(config);
    this.instances.set(name, instance);
    return instance;
  }

  getInstance(name: string): AxiosInstance {
    const instance = this.instances.get(name);
    if (!instance) {
      throw new Error(`API instance '${name}' not found`);
    }
    return instance;
  }

  hasInstance(name: string): boolean {
    return this.instances.has(name);
  }

  removeInstance(name: string): boolean {
    return this.instances.delete(name);
  }

  clear(): void {
    this.instances.clear();
  }
}
