import { StorageAdapter } from '../../../../types/quantum-file-upload';
import { MockStorageAdapter } from './mock/mock-storage-adapter';
import { SupabaseStorageAdapter } from './supabase/supabase-storage-adapter';

export interface MockStorageConfig {
  type: 'mock';
  uploadDelay?: number;
}

export interface SupabaseStorageConfig {
  type: 'supabase';
  bucket: string;
  tusEndpoint: string;
}

export interface S3StorageConfig {
  type: 's3';
  bucket: string;
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export interface AzureStorageConfig {
  type: 'azure';
  connectionString: string;
  containerName: string;
}

export type StorageConfig = 
  | MockStorageConfig 
  | SupabaseStorageConfig 
  | S3StorageConfig 
  | AzureStorageConfig;

/**
 * Factory for creating storage adapters
 */
export class StorageFactory {
  static create(config: StorageConfig): StorageAdapter {
    switch (config.type) {
      case 'mock':
        return new MockStorageAdapter(config.uploadDelay || 2000);

      case 'supabase':
        return new SupabaseStorageAdapter(config.bucket, config.tusEndpoint);

      case 's3':
        throw new Error('S3 adapter not yet implemented. Create S3StorageAdapter class.');

      case 'azure':
        throw new Error('Azure adapter not yet implemented. Create AzureStorageAdapter class.');

      default:
        throw new Error(`Unknown storage type: ${(config as any).type}`);
    }
  }

  static fromEnv(): StorageAdapter {
    const type = process.env.STORAGE_TYPE || 'mock';

    switch (type) {
      case 'supabase':
        return new SupabaseStorageAdapter(
          process.env.SUPABASE_BUCKET || 'file-storage',
          process.env.VITE_TUS_URL_PATH || ''
        );

      case 'mock':
      default:
        return new MockStorageAdapter(2000);
    }
  }
}
