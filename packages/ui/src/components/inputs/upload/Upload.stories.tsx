import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Upload, UploadBox, UploadAvatar } from './index';
import type { FileUploadType, FilesUploadType } from './types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const meta: Meta<typeof Upload> = {
  title: 'Inputs/Upload',
  component: Upload,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Upload

A comprehensive file upload component suite with drag-and-drop support, file previews, and multiple variants.

## Features

- 📤 **Drag & Drop** - Native drag and drop support
- 🖼️ **Image Preview** - Preview uploaded images
- 📁 **Multiple Files** - Support for single or multiple file uploads
- 🎯 **File Validation** - Size, type, and count validation
- 🎨 **Multiple Variants** - Default, Box, and Avatar styles
- ♿ **Accessible** - Full keyboard navigation and ARIA support
- 🌙 **Theme Aware** - Adapts to light/dark themes

## Variants

### Upload (Default)
Full-featured upload area with file preview, progress, and actions

### UploadBox
Compact upload box for forms and constrained spaces

### UploadAvatar
Circular avatar upload for profile pictures

## Usage

\`\`\`tsx
import { Upload, UploadBox, UploadAvatar } from '@asyml8/ui';

// Single file upload
const [file, setFile] = useState<File | string | null>(null);

<Upload
  value={file}
  onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
  onDelete={() => setFile(null)}
/>

// Multiple files upload
const [files, setFiles] = useState<(File | string)[]>([]);

<Upload
  multiple
  value={files}
  onDrop={(acceptedFiles) => setFiles([...files, ...acceptedFiles])}
  onRemove={(file) => setFiles(files.filter(f => f !== file))}
  onRemoveAll={() => setFiles([])}
/>

// Avatar upload
<UploadAvatar
  value={file}
  onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Upload>;

// Single File Upload
export const SingleFile: Story = {
  render: () => {
    const [file, setFile] = useState<FileUploadType>(null);

    return (
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Single File Upload
          </Typography>
          <Upload
            value={file}
            onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
            onDelete={() => setFile(null)}
          />
        </CardContent>
      </Card>
    );
  },
};

// Multiple Files Upload
export const MultipleFiles: Story = {
  render: () => {
    const [files, setFiles] = useState<FilesUploadType>([]);

    return (
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Multiple Files Upload
          </Typography>
          <Upload
            multiple
            value={files}
            onDrop={(acceptedFiles) => setFiles([...files, ...acceptedFiles])}
            onRemove={(file) => setFiles(files.filter((f) => f !== file))}
            onRemoveAll={() => setFiles([])}
            onUpload={() => console.log('Uploading:', files)}
          />
        </CardContent>
      </Card>
    );
  },
};

// With File Type Restrictions
export const WithFileTypeRestrictions: Story = {
  render: () => {
    const [file, setFile] = useState<FileUploadType>(null);

    return (
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Images Only
          </Typography>
          <Upload
            value={file}
            accept={{ 'image/*': [] }}
            onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
            onDelete={() => setFile(null)}
            helperText="Only image files (PNG, JPG, GIF, etc.) are allowed"
          />
        </CardContent>
      </Card>
    );
  },
};

// With File Size Limit
export const WithFileSizeLimit: Story = {
  render: () => {
    const [file, setFile] = useState<FileUploadType>(null);

    return (
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Max 2MB File Size
          </Typography>
          <Upload
            value={file}
            maxSize={2 * 1024 * 1024} // 2MB
            onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
            onDelete={() => setFile(null)}
            helperText="Maximum file size: 2MB"
          />
        </CardContent>
      </Card>
    );
  },
};

// With Loading State
export const WithLoading: Story = {
  render: () => {
    const [file, setFile] = useState<FileUploadType>(null);
    const [loading, setLoading] = useState(false);

    const handleDrop = (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0]);
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };

    return (
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upload with Loading State
          </Typography>
          <Upload
            value={file}
            loading={loading}
            onDrop={handleDrop}
            onDelete={() => setFile(null)}
            helperText="Simulates a 2-second upload delay"
          />
        </CardContent>
      </Card>
    );
  },
};

// With Error State
export const WithError: Story = {
  render: () => {
    const [file, setFile] = useState<FileUploadType>(null);

    return (
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upload with Error
          </Typography>
          <Upload
            value={file}
            error={true}
            onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
            onDelete={() => setFile(null)}
            helperText="There was an error uploading the file"
          />
        </CardContent>
      </Card>
    );
  },
};

// Disabled State
export const Disabled: Story = {
  render: () => (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Disabled Upload
        </Typography>
        <Upload disabled helperText="Upload is disabled" />
      </CardContent>
    </Card>
  ),
};

// Upload Box Variant
export const BoxVariant: Story = {
  render: () => {
    const [file, setFile] = useState<FileUploadType>(null);

    return (
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upload Box
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Compact upload box for forms
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <UploadBox onDrop={(acceptedFiles) => setFile(acceptedFiles[0])} />
            {file && (
              <Typography variant="body2">
                Selected: {file instanceof File ? file.name : file}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  },
};

// Avatar Upload Variant
export const AvatarVariant: Story = {
  render: () => {
    const [avatar, setAvatar] = useState<FileUploadType>(null);

    return (
      <Card sx={{ maxWidth: 400, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom textAlign="center">
            Profile Picture
          </Typography>
          <UploadAvatar
            value={avatar}
            onDrop={(acceptedFiles) => setAvatar(acceptedFiles[0])}
            helperText="Upload a profile picture (PNG, JPG, max 5MB)"
          />
        </CardContent>
      </Card>
    );
  },
};

// Avatar with Loading
export const AvatarWithLoading: Story = {
  render: () => {
    const [avatar, setAvatar] = useState<FileUploadType>(null);
    const [loading, setLoading] = useState(false);

    const handleDrop = (acceptedFiles: File[]) => {
      setAvatar(acceptedFiles[0]);
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };

    return (
      <Card sx={{ maxWidth: 400, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom textAlign="center">
            Profile Picture Upload
          </Typography>
          <UploadAvatar value={avatar} loading={loading} onDrop={handleDrop} />
        </CardContent>
      </Card>
    );
  },
};

// Multiple Files with Vertical Preview
export const VerticalPreview: Story = {
  render: () => {
    const [files, setFiles] = useState<FilesUploadType>([]);

    return (
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Vertical File Preview
          </Typography>
          <Upload
            multiple
            value={files}
            previewOrientation="vertical"
            onDrop={(acceptedFiles) => setFiles([...files, ...acceptedFiles])}
            onRemove={(file) => setFiles(files.filter((f) => f !== file))}
            onRemoveAll={() => setFiles([])}
          />
        </CardContent>
      </Card>
    );
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => {
    const [defaultFile, setDefaultFile] = useState<FileUploadType>(null);
    const [boxFile, setBoxFile] = useState<FileUploadType>(null);
    const [avatarFile, setAvatarFile] = useState<FileUploadType>(null);

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Upload Component Variants
        </Typography>

        <Stack spacing={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Default Upload
              </Typography>
              <Upload
                value={defaultFile}
                onDrop={(acceptedFiles) => setDefaultFile(acceptedFiles[0])}
                onDelete={() => setDefaultFile(null)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Box Upload
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <UploadBox onDrop={(acceptedFiles) => setBoxFile(acceptedFiles[0])} />
                {boxFile && (
                  <Typography variant="body2">
                    {boxFile instanceof File ? boxFile.name : boxFile}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom textAlign="center">
                Avatar Upload
              </Typography>
              <UploadAvatar
                value={avatarFile}
                onDrop={(acceptedFiles) => setAvatarFile(acceptedFiles[0])}
              />
            </CardContent>
          </Card>
        </Stack>
      </Box>
    );
  },
};

// Single File List Preview Mode
export const SingleFileListPreview: Story = {
  render: () => {
    const [file, setFile] = useState<FileUploadType>(null);

    const handleDownload = (file: File) => {
      console.log('Downloading:', file.name);
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <Card sx={{ maxWidth: 1200, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Single File List Preview
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Single file upload with list preview - upload area stays active
          </Typography>
          <Upload
            value={file}
            previewMode="list"
            previewLayout="side-by-side"
            onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
            onDelete={() => setFile(null)}
            onDownload={handleDownload}
          />
        </CardContent>
      </Card>
    );
  },
};

// File List Side-by-Side Layout
export const FileListSideBySide: Story = {
  render: () => {
    const [files, setFiles] = useState<FilesUploadType>([]);

    const handleDownload = (file: File) => {
      console.log('Downloading:', file.name);
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <Card sx={{ maxWidth: 1200, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            File List Side-by-Side Layout
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload area and file list displayed side-by-side with equal width
          </Typography>
          <Upload
            multiple
            value={files}
            previewMode="list"
            previewLayout="side-by-side"
            onDrop={(acceptedFiles) => setFiles([...files, ...acceptedFiles])}
            onRemove={(file) => setFiles(files.filter((f) => f !== file))}
            onDownload={handleDownload}
          />
        </CardContent>
      </Card>
    );
  },
};

// File List Preview Mode
export const FileListPreview: Story = {
  render: () => {
    const [files, setFiles] = useState<FilesUploadType>([]);

    const handleDownload = (file: File) => {
      console.log('Downloading:', file.name);
      // Simulate download
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            File List Preview Mode
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Clean horizontal layout with download and delete actions
          </Typography>
          <Upload
            multiple
            value={files}
            previewMode="list"
            onDrop={(acceptedFiles) => setFiles([...files, ...acceptedFiles])}
            onRemove={(file) => setFiles(files.filter((f) => f !== file))}
            onDownload={handleDownload}
          />
        </CardContent>
      </Card>
    );
  },
};

// Custom Placeholder
export const CustomPlaceholder: Story = {
  render: () => {
    const [file, setFile] = useState<FileUploadType>(null);

    return (
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Custom Placeholder
          </Typography>
          <Upload
            value={file}
            placeholder={
              <Box textAlign="center">
                <Typography variant="h6" color="primary">
                  📦 Drop your file here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or click to browse
                </Typography>
              </Box>
            }
            onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
            onDelete={() => setFile(null)}
          />
        </CardContent>
      </Card>
    );
  },
};
