/**
 * Common interface for resource services across all APIs
 */
export interface ResourceService<T = any> {
  [key: string]: (...args: any[]) => Promise<any>;
}

/**
 * Common interface for API service collections
 * Each API (Flux, Foundry) implements this with their specific resources
 */
export interface ApiServices {
  [resourceName: string]: ResourceService;
}
