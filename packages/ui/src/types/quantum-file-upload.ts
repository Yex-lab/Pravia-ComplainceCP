export type FileUploadStatus =
  | 'uploading'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'duplicated'
  | 'exceded'
  | 'fileType'
  | 'orgFileSizeLimitExceeded';

export interface FileDetail {
  id?: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: FileUploadStatus;
  statusMessage?: string;
  modified?: Date;
  userId?: string;
  userName?: string;
  userEmail?: string;
}

export interface ValidationConfig {
  maxFileSize: number;
  allowedTypes: string[];
  storageLimit?: number;
  storageUsed?: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: FileUploadStatus;
}

export interface UploadConfig extends ValidationConfig {
  maxFiles?: number;
  autoClose?: boolean;
}

export interface StorageAdapter {
  upload(file: File, onProgress: (progress: number) => void): Promise<string>;
  validateFile(file: File, config: ValidationConfig): ValidationResult;
}

export interface RealtimeAdapter {
  subscribe(handlers: {
    onProgress: (fileId: string, progress: number) => void;
    onComplete: (fileId: string) => void;
    onError: (fileId: string, error: string) => void;
  }): () => void;
  start(): void;
  stop(): void;
}

export interface UseFileUploadReturn {
  files: FileDetail[];
  uploadFiles: (files: FileList) => Promise<void>;
  processQueue: () => Promise<void>;
  queuedFiles: File[];
  isDrawerOpen: boolean;
  closeDrawer: () => void;
  errorCount: number;
  completeCount: number;
}

// FileCard types for customizable file display
export type FileCardVariant = 'list' | 'card' | 'compact' | 'detailed';
export type FileCardSize = 'small' | 'medium' | 'large';

export interface FileCardColors {
  background?: string;
  hoverBackground?: string;
  border?: string;
  iconBackground?: string;
  primaryText?: string;
  secondaryText?: string;
  progressBar?: string;
  errorColor?: string;
  successColor?: string;
}

export interface FileCardSpacing {
  padding?: number | string;
  gap?: number | string;
  borderRadius?: number | string;
}

export interface FileCardIconConfig {
  size?: number;
  showFileType?: boolean;
  colorByType?: boolean;
}

export interface FileCardProgressConfig {
  show?: boolean;
  height?: number;
  position?: 'bottom' | 'inline';
  showPercentage?: boolean;
}

export interface FileCardActionsConfig {
  show?: boolean;
  position?: 'right' | 'bottom';
  buttons?: Array<'download' | 'delete' | 'preview' | 'share'>;
}

export interface FileCardStyleConfig {
  variant?: FileCardVariant;
  size?: FileCardSize;
  colors?: FileCardColors;
  spacing?: FileCardSpacing;
  icon?: FileCardIconConfig;
  progress?: FileCardProgressConfig;
  actions?: FileCardActionsConfig;
}

export interface FileCardProps {
  file: FileDetail;
  styleConfig?: FileCardStyleConfig;
  onDownload?: (file: FileDetail) => void;
  onDelete?: (file: FileDetail) => void;
  onPreview?: (file: FileDetail) => void;
  showMetadata?: boolean;
}
