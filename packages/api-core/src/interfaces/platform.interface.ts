import type { QueryOptions } from '../dataverse/types/dataverse.types';

export type { QueryOptions };

export interface IPlatformService {
  create<T>(entity: string, data: Partial<T>): Promise<T>;
  read<T>(entity: string, id: string): Promise<T | null>;
  update<T>(entity: string, id: string, data: Partial<T>): Promise<T>;
  delete(entity: string, id: string): Promise<void>;
  query<T>(entity: string, options?: QueryOptions): Promise<T[]>;
  batch(operations: BatchOperation[]): Promise<BatchResult[]>;
}

export interface BatchOperation {
  method: 'POST' | 'PATCH' | 'DELETE';
  entity: string;
  id?: string;
  data?: Record<string, unknown>;
}

export interface BatchResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}
