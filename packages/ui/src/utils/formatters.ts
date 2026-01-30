import { FileDetail } from '../types/quantum-file-upload';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const createFileDetail = (file: File, userId?: string): FileDetail => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    progress: 0,
    status: 'uploading',
    modified: new Date(),
    userId,
  };
};
