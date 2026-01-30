import type { UploadProps } from '../types';

import { useDropzone } from 'react-dropzone';
import { mergeClasses } from '../../../../utils/merge-classes';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from '../../../data-display/iconify';
import { uploadClasses } from '../classes';
import { RejectedFiles } from '../components/rejected-files';
import { MultiFilePreview } from '../components/multi-file-preview';
import { SingleFilePreview } from '../components/single-file-preview';
import { FileListPreview } from '../components/file-list-preview';
import { UploadArea, DeleteButton, UploadWrapper, PlaceholderContainer } from './styles';

// ----------------------------------------------------------------------

export function Upload({
  sx,
  value,
  error,
  disabled,
  onDelete,
  onUpload,
  onRemove,
  className,
  helperText,
  onRemoveAll,
  onDownload,
  slotProps,
  placeholder,
  loading = false,
  multiple = false,
  hideFilesRejected = false,
  previewOrientation = 'horizontal',
  previewMode = 'thumbnail',
  previewLayout = 'stacked',
  showFileListPlaceholder = true,
  fileListPlaceholderText = 'File list',
  minHeight = 280,
  maxHeight,
  ...dropzoneOptions
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple,
    disabled,
    ...dropzoneOptions,
  });

  const isSingleFileSelected = !multiple && !!value && !Array.isArray(value);
  const hasMultiFilesSelected = multiple && Array.isArray(value) && value.length > 0;
  const hasError = isDragReject || !!error;
  const showFilesRejected = !hideFilesRejected && fileRejections.length > 0;

  const renderPlaceholder = () => (
    <PlaceholderContainer className={uploadClasses.placeholder.root}>
      {placeholder ?? (
        <>
          <Iconify
            icon="eva:cloud-upload-fill"
            width={80}
            sx={{ mb: 2, color: 'text.disabled' }}
          />
          <div className={uploadClasses.placeholder.content}>
            <div className={uploadClasses.placeholder.title}>
              {multiple ? 'Drop or select files' : 'Drop or select a file'}
            </div>
            <div className={uploadClasses.placeholder.description}>
              {multiple ? 'Drag files here' : 'Drag a file here'}, or <span>browse</span> your device.
            </div>
          </div>
        </>
      )}
    </PlaceholderContainer>
  );

  const renderSingleFileLoading = () =>
    loading &&
    !multiple && (
      <CircularProgress
        size={26}
        color="primary"
        sx={{ zIndex: 9, right: 16, bottom: 16, position: 'absolute' }}
      />
    );

  const renderSingleFilePreview = () => {
    if (!isSingleFileSelected) return null;
    
    if (previewMode === 'list') {
      return <FileListPreview files={value || []} onRemove={() => onDelete?.()} onDownload={onDownload} layout={previewLayout} />;
    }
    
    return <SingleFilePreview file={value} />;
  };

  const renderMultiFilesPreview = () => {
    if (!hasMultiFilesSelected) return null;

    if (previewMode === 'list') {
      return (
        <FileListPreview 
          files={value} 
          onRemove={onRemove} 
          onDownload={onDownload} 
          layout={previewLayout}
          showPlaceholder={previewLayout === 'side-by-side' ? showFileListPlaceholder : false}
          placeholderText={fileListPlaceholderText}
        />
      );
    }

    return (
      <>
        <Box sx={{ my: 3 }}>
          <MultiFilePreview
            files={value}
            onRemove={onRemove}
            orientation={previewOrientation}
            {...slotProps?.multiPreview}
          />
        </Box>

        {(onRemoveAll || onUpload) && (
          <Box sx={{ gap: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
            {onRemoveAll && (
              <Button size="small" variant="outlined" color="inherit" onClick={onRemoveAll}>
                Remove All
              </Button>
            )}
            {onUpload && (
              <Button
                size="small"
                variant="contained"
                onClick={onUpload}
                startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                disabled={loading && multiple}
              >
                {loading && multiple ? 'Uploading..' : 'Upload'}
              </Button>
            )}
          </Box>
        )}
      </>
    );
  };

  return (
    <UploadWrapper {...slotProps?.wrapper} className={uploadClasses.wrapper}>
      <Box sx={{ 
        display: previewMode === 'list' && previewLayout === 'side-by-side' ? 'flex' : 'block',
        gap: previewMode === 'list' && previewLayout === 'side-by-side' ? 2 : 0
      }}>
        <Box sx={{ 
          flex: previewMode === 'list' && previewLayout === 'side-by-side' ? '1' : 'none'
        }}>
          <UploadArea
            {...getRootProps()}
            className={mergeClasses([uploadClasses.default, className], {
              [uploadClasses.state.dragActive]: isDragActive,
              [uploadClasses.state.disabled]: disabled || (previewMode === 'list' && isSingleFileSelected),
              [uploadClasses.state.error]: hasError,
            })}
            sx={[{ minHeight, maxHeight }, ...(Array.isArray(sx) ? sx : [sx])]}
          >
            <input {...getInputProps()} disabled={disabled || (previewMode === 'list' && isSingleFileSelected)} />
            {isSingleFileSelected && previewMode !== 'list' ? renderSingleFilePreview() : renderPlaceholder()}
          </UploadArea>

          {isSingleFileSelected && previewMode !== 'list' && (
            <DeleteButton size="small" onClick={onDelete}>
              <Iconify icon="mingcute:close-line" width={16} />
            </DeleteButton>
          )}

          {helperText && <FormHelperText error={!!error}>{helperText}</FormHelperText>}
          {showFilesRejected && <RejectedFiles files={fileRejections} {...slotProps?.rejectedFiles} />}

          {renderSingleFileLoading()}
          {previewMode !== 'list' && renderMultiFilesPreview()}
        </Box>
        
        {previewMode === 'list' && previewLayout === 'side-by-side' && (
          <FileListPreview 
            files={value || []} 
            onRemove={onRemove || (() => onDelete?.())} 
            onDownload={onDownload} 
            layout={previewLayout}
            showPlaceholder={showFileListPlaceholder}
            placeholderText={fileListPlaceholderText}
          />
        )}
        
        {previewMode === 'list' && previewLayout === 'stacked' && (isSingleFileSelected || hasMultiFilesSelected) && renderSingleFilePreview()}
        {previewMode !== 'list' && isSingleFileSelected && renderSingleFilePreview()}
      </Box>
    </UploadWrapper>
  );
}
