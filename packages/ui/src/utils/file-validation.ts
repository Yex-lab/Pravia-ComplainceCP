import { ValidationConfig, ValidationResult, FileUploadStatus } from '../types/quantum-file-upload';

export const validateFileSize = (size: number, maxSize: number): boolean => {
  return size < maxSize;
};

export const validateFileType = (fileName: string, allowedTypes: string[]): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
};

export const validateStorageLimit = (
  fileSize: number,
  storageUsed: number = 0,
  storageLimit?: number
): boolean => {
  if (!storageLimit) return true;
  return storageUsed + fileSize < storageLimit;
};

export const validateFile = (
  file: File,
  config: ValidationConfig,
  existingFiles: string[] = []
): ValidationResult => {
  // Check duplicates
  if (existingFiles.includes(file.name)) {
    return { isValid: false, error: 'duplicated' };
  }

  // Check file size
  if (!validateFileSize(file.size, config.maxFileSize)) {
    return { isValid: false, error: 'exceded' };
  }

  // Check storage limit
  if (!validateStorageLimit(file.size, config.storageUsed, config.storageLimit)) {
    return { isValid: false, error: 'orgFileSizeLimitExceeded' };
  }

  // Check file type
  if (!validateFileType(file.name, config.allowedTypes)) {
    return { isValid: false, error: 'fileType' };
  }

  return { isValid: true };
};
