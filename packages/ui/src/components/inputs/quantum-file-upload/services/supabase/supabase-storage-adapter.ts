import { StorageAdapter, ValidationConfig, ValidationResult } from '../../../../../types/quantum-file-upload';
import { validateFile } from '../../../../../utils/file-validation';

/**
 * Supabase Storage Adapter using TUS protocol
 * 
 * @example
 * ```ts
 * import * as tus from 'tus-js-client';
 * 
 * const adapter = new SupabaseStorageAdapter(
 *   'file-storage',
 *   'https://your-project.supabase.co/storage/v1/upload/resumable'
 * );
 * ```
 */
export class SupabaseStorageAdapter implements StorageAdapter {
  private bucket: string;
  private tusEndpoint: string;

  constructor(bucket: string, tusEndpoint: string) {
    this.bucket = bucket;
    this.tusEndpoint = tusEndpoint;
  }

  async upload(file: File, onProgress: (progress: number) => void): Promise<string> {
    // Dynamic import to avoid bundling TUS if not used
    const tus = await import('tus-js-client');

    return new Promise((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint: this.tusEndpoint,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
          filename: file.name,
          filetype: file.type,
          bucket: this.bucket,
        },
        onError: (error: Error) => {
          reject(error);
        },
        onProgress: (bytesUploaded: number, bytesTotal: number) => {
          // Upload phase: 0-50%
          const percentage = Math.floor((bytesUploaded / bytesTotal) * 50);
          onProgress(percentage);
        },
        onSuccess: () => {
          const fileId = upload.url?.split('/').pop() || '';
          // Mark as 50% - processing will take it to 100%
          onProgress(50);
          resolve(fileId);
        },
      });

      upload.start();
    });
  }

  validateFile(file: File, config: ValidationConfig): ValidationResult {
    return validateFile(file, config);
  }
}
