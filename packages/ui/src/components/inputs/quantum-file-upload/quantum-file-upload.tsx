import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useFileUpload } from './hooks/use-file-upload';
import { UploadDrawer } from './components/upload-drawer/upload-drawer';
import { UploadZone } from './components/upload-zone/upload-zone';
import { FileUploadButton } from './components/file-upload-button/file-upload-button';
import { StorageAdapter, UploadConfig, FileCardStyleConfig, FileDetail } from '../../../types/quantum-file-upload';

interface QuantumFileUploadProps {
  storageAdapter: StorageAdapter;
  config: UploadConfig;
  existingFiles?: string[];
  userId?: string;
  title?: string;
  showButton?: boolean;
  showZone?: boolean;
  queueMode?: boolean;
  messages?: Record<string, string>;
  fileCardStyle?: FileCardStyleConfig;
  onDownload?: (file: FileDetail) => void;
  onDelete?: (file: FileDetail) => void;
  onQueueChange?: (queuedFiles: File[]) => void;
  onProcessQueue?: (processQueue: () => Promise<void>) => void;
}

export const QuantumFileUpload = ({
  storageAdapter,
  config,
  existingFiles,
  userId,
  title = 'File Upload',
  showButton = true,
  showZone = true,
  queueMode = false,
  messages,
  fileCardStyle,
  onDownload,
  onDelete,
  onQueueChange,
  onProcessQueue,
}: QuantumFileUploadProps) => {
  const { files, uploadFiles, processQueue, queuedFiles, isDrawerOpen, closeDrawer, errorCount, completeCount } = useFileUpload({
    storageAdapter,
    config,
    existingFiles,
    userId,
    queueMode,
  });

  useEffect(() => {
    if (onQueueChange) {
      onQueueChange(queuedFiles);
    }
  }, [queuedFiles, onQueueChange]);

  useEffect(() => {
    if (onProcessQueue) {
      onProcessQueue(processQueue);
    }
  }, [processQueue, onProcessQueue]);

  const handleFilesSelected = async (fileList: FileList) => {
    console.log('handleFilesSelected called with', fileList.length, 'files');
    await uploadFiles(fileList);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">{title}</Typography>
          {showButton && <FileUploadButton onFilesSelected={handleFilesSelected} label="Upload Files" />}
        </Stack>

        {/* Stats */}
        <Typography variant="body2" color="text.secondary">
          Total: {files.length} | Completed: {completeCount} | Errors: {errorCount}
        </Typography>

        {/* Upload Zone */}
        {showZone && (
          <UploadZone
            onFilesSelected={handleFilesSelected}
            accept={{
              'application/pdf': ['.pdf'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
              'text/plain': ['.txt'],
              'image/png': ['.png'],
              'image/jpeg': ['.jpg', '.jpeg'],
            }}
          />
        )}
      </Stack>

      {/* Upload Drawer */}
      <UploadDrawer
        open={isDrawerOpen}
        files={files}
        errorCount={errorCount}
        onClose={closeDrawer}
        title="Uploading Files"
        closeButtonText="Close"
        errorMessage="files failed to upload"
        messages={messages}
        fileCardStyle={fileCardStyle}
        onDownload={onDownload}
        onDelete={onDelete}
      />
    </Box>
  );
};
