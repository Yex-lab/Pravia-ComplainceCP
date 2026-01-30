import { useRef } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface FileUploadButtonProps extends Omit<ButtonProps, 'onChange'> {
  onFilesSelected: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
}

export const FileUploadButton = ({
  onFilesSelected,
  accept,
  multiple = true,
  label = 'Upload',
  ...buttonProps
}: FileUploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <Button
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
      {...buttonProps}
    >
      {label}
      <VisuallyHiddenInput
        ref={inputRef}
        multiple={multiple}
        type="file"
        accept={accept}
        onChange={handleChange}
      />
    </Button>
  );
};
