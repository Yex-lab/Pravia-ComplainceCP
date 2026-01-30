import { StorageAdapter, ValidationConfig, ValidationResult } from '../../../../../types/quantum-file-upload';
import { validateFile } from '../../../../../utils/file-validation';

export class MockStorageAdapter implements StorageAdapter {
  private uploadDelay: number;

  constructor(uploadDelay: number = 2000) {
    this.uploadDelay = uploadDelay;
  }

  async upload(file: File, onProgress: (progress: number) => void): Promise<string> {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          resolve(`file-${Date.now()}-${file.name}`);
        }
      }, this.uploadDelay / 10);
    });
  }

  validateFile(file: File, config: ValidationConfig): ValidationResult {
    return validateFile(file, config);
  }
}
