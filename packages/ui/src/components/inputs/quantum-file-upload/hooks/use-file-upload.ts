import { useState, useCallback, useEffect } from 'react';
import { FileDetail, UploadConfig, StorageAdapter, RealtimeAdapter, UseFileUploadReturn } from '../../../../types/quantum-file-upload';
import { validateFile } from '../../../../utils/file-validation';
import { createFileDetail } from '../../../../utils/formatters';

interface UseFileUploadProps {
  storageAdapter: StorageAdapter;
  realtimeAdapter?: RealtimeAdapter;
  config: UploadConfig;
  existingFiles?: string[];
  userId?: string;
  queueMode?: boolean;
}

export const useFileUpload = ({
  storageAdapter,
  realtimeAdapter,
  config,
  existingFiles = [],
  userId,
  queueMode = false,
}: UseFileUploadProps): UseFileUploadReturn => {
  const [files, setFiles] = useState<FileDetail[]>([]);
  const [queuedFiles, setQueuedFiles] = useState<File[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [completeCount, setCompleteCount] = useState(0);

  useEffect(() => {
    const errors = files.filter(
      (f) => f.status !== 'completed' && f.status !== 'uploading' && f.status !== 'processing'
    );
    const complete = files.filter((f) => f.status === 'completed');

    setErrorCount(errors.length);
    setCompleteCount(complete.length);
  }, [files]);

  useEffect(() => {
    const allProcessed = errorCount + completeCount === files.length;
    const hasNoErrors = errorCount === 0;

    if (allProcessed && hasNoErrors && files.length > 0 && config.autoClose !== false) {
      setIsDrawerOpen(false);
    }
  }, [errorCount, completeCount, files.length, config.autoClose]);

  useEffect(() => {
    if (!realtimeAdapter) return;

    const unsubscribe = realtimeAdapter.subscribe({
      onProgress: (fileId, progress) => {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        );
      },
      onComplete: (fileId) => {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: 'completed', progress: 100 } : f))
        );
      },
      onError: (fileId, error) => {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: 'failed' } : f))
        );
      },
    });

    realtimeAdapter.start();

    return () => {
      unsubscribe();
      realtimeAdapter.stop();
    };
  }, [realtimeAdapter]);

  const uploadFiles = useCallback(
    async (fileList: FileList) => {
      const fileArray = Array.from(fileList);
      const validatedFiles: FileDetail[] = [];

      console.log('uploadFiles called with', fileArray.length, 'files, queueMode:', queueMode);

      // Validate all files
      fileArray.forEach((file) => {
        const fileDetail = createFileDetail(file, userId);
        const validation = validateFile(file, config, existingFiles);

        if (!validation.isValid && validation.error) {
          fileDetail.status = validation.error;
        }

        validatedFiles.push(fileDetail);
      });

      setFiles(validatedFiles);
      setIsDrawerOpen(true);

      // If queue mode, just store files and don't upload
      if (queueMode) {
        const validFiles = fileArray.filter((file, index) => validatedFiles[index].status === 'uploading');
        console.log('Queue mode: adding', validFiles.length, 'valid files to queue');
        setQueuedFiles((prev) => [...prev, ...validFiles]);
        return;
      }

      // Upload valid files in parallel
      const uploadPromises = validatedFiles.map(async (fileDetail) => {
        if (fileDetail.status === 'uploading') {
          const file = fileArray.find((f) => f.name === fileDetail.name);
          if (file) {
            try {
              const fileId = await storageAdapter.upload(file, (progress) => {
                setFiles((prev) =>
                  prev.map((f) => (f.name === fileDetail.name ? { ...f, progress } : f))
                );
              });

              setFiles((prev) =>
                prev.map((f) => (f.name === fileDetail.name ? { ...f, id: fileId, status: 'completed', progress: 100 } : f))
              );
            } catch (error) {
              setFiles((prev) =>
                prev.map((f) => (f.name === fileDetail.name ? { ...f, status: 'failed' } : f))
              );
            }
          }
        }
      });

      await Promise.all(uploadPromises);
    },
    [storageAdapter, config, existingFiles, userId, queueMode]
  );

  const processQueue = useCallback(async () => {
    if (queuedFiles.length === 0) return;

    const uploadPromises = queuedFiles.map(async (file) => {
      const fileDetail = files.find((f) => f.name === file.name);
      if (fileDetail && fileDetail.status === 'uploading') {
        try {
          const fileId = await storageAdapter.upload(file, (progress) => {
            setFiles((prev) =>
              prev.map((f) => (f.name === file.name ? { ...f, progress } : f))
            );
          });

          setFiles((prev) =>
            prev.map((f) => (f.name === file.name ? { ...f, id: fileId, status: 'completed', progress: 100 } : f))
          );
        } catch (error) {
          setFiles((prev) =>
            prev.map((f) => (f.name === file.name ? { ...f, status: 'failed' } : f))
          );
        }
      }
    });

    await Promise.all(uploadPromises);
    setQueuedFiles([]);
  }, [queuedFiles, files, storageAdapter]);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setFiles((prev) => prev.filter((f) => f.status === 'processing'));
  }, []);

  return {
    files,
    uploadFiles,
    processQueue,
    queuedFiles,
    isDrawerOpen,
    closeDrawer,
    errorCount,
    completeCount,
  };
};
