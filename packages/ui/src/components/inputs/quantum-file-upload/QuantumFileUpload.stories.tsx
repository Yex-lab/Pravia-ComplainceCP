import type { Meta, StoryObj } from '@storybook/react';
import Typography from '@mui/material/Typography';
import { QuantumFileUpload } from './quantum-file-upload';
import { MockStorageAdapter } from './services/mock';
import { UploadDrawer } from './components/upload-drawer/upload-drawer';

const meta: Meta<typeof QuantumFileUpload> = {
  title: 'Inputs/Quantum File Upload',
  component: QuantumFileUpload,
  parameters: {
    docs: {
      description: {
        component: `
# QuantumFileUpload

Advanced file upload component with drag & drop, progress tracking, and storage adapter pattern.

## Features

- 📤 **Multiple upload methods** - Button click or drag & drop
- 📊 **Real-time progress** - Track upload status for each file
- ✅ **Validation** - File size, type, and storage limit validation
- 🔄 **Retry logic** - Automatic retry on failure
- 🎨 **Customizable** - Messages, labels, and behavior
- 🔌 **Adapter pattern** - Support for multiple storage backends (Mock, Supabase, S3, Azure)
- 📱 **Responsive** - Works on mobile and desktop

## Usage

\`\`\`tsx
import { QuantumFileUpload, MockStorageAdapter } from '@asyml8/ui';

const storageAdapter = new MockStorageAdapter(2000);

function App() {
  return (
    <QuantumFileUpload
      storageAdapter={storageAdapter}
      config={{
        maxFileSize: 500 * 1024 * 1024, // 500MB
        allowedTypes: ['pdf', 'docx', 'xlsx', 'txt', 'png', 'jpg', 'jpeg'],
        autoClose: true,
      }}
      existingFiles={['existing-file.pdf']}
      userId="user-123"
      title="Upload Documents"
      showButton={true}
      showZone={true}
    />
  );
}
\`\`\`

## Storage Adapters

### Mock Adapter (for testing)
\`\`\`tsx
import { MockStorageAdapter } from '@asyml8/ui';
const adapter = new MockStorageAdapter(2000); // 2 second delay
\`\`\`

### Supabase Adapter
\`\`\`tsx
import { SupabaseStorageAdapter } from '@asyml8/ui';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);
const adapter = new SupabaseStorageAdapter(supabase, 'bucket-name');
\`\`\`

## Validation Config

\`\`\`tsx
config={{
  maxFileSize: 500 * 1024 * 1024, // 500MB
  allowedTypes: ['pdf', 'docx', 'xlsx', 'txt', 'png', 'jpg', 'jpeg'],
  maxFiles: 10,
  orgStorageLimit: 10 * 1024 * 1024 * 1024, // 10GB
  autoClose: true,
}}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    storageAdapter: {
      description: 'Storage adapter for handling file uploads',
      control: false,
    },
    config: {
      description: 'Upload configuration (file size, types, limits)',
      control: 'object',
    },
    existingFiles: {
      description: 'Array of existing file names to check for duplicates',
      control: 'object',
    },
    userId: {
      description: 'User ID for tracking uploads',
      control: 'text',
    },
    title: {
      description: 'Component title',
      control: 'text',
    },
    showButton: {
      description: 'Show upload button',
      control: 'boolean',
    },
    showZone: {
      description: 'Show drag & drop zone',
      control: 'boolean',
    },
    messages: {
      description: 'Custom messages for different upload states',
      control: 'object',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QuantumFileUpload>;

const storageAdapter = new MockStorageAdapter(2000);

const defaultMessages = {
  completed: 'Upload completed',
  failed: 'Upload failed',
  duplicated: 'File already exists',
  exceded: 'File size exceeds limit',
  fileType: 'File type not allowed',
  orgFileSizeLimitExceeded: 'Storage limit exceeded',
};

export const Default: Story = {
  args: {
    storageAdapter,
    config: {
      maxFileSize: 500 * 1024 * 1024, // 500MB
      allowedTypes: ['pdf', 'docx', 'xlsx', 'txt', 'png', 'jpg', 'jpeg'],
      autoClose: true,
    },
    existingFiles: ['existing-file.pdf'],
    userId: 'demo-user',
    title: 'Upload Documents',
    showButton: true,
    showZone: true,
    messages: defaultMessages,
  },
};

export const ButtonOnly: Story = {
  args: {
    storageAdapter,
    config: {
      maxFileSize: 100 * 1024 * 1024, // 100MB
      allowedTypes: ['pdf', 'docx'],
      autoClose: false,
    },
    userId: 'demo-user',
    title: 'Upload PDF or Word Documents',
    showButton: true,
    showZone: false,
    messages: defaultMessages,
  },
};

export const DropZoneOnly: Story = {
  args: {
    storageAdapter,
    config: {
      maxFileSize: 50 * 1024 * 1024, // 50MB
      allowedTypes: ['png', 'jpg', 'jpeg'],
      autoClose: true,
    },
    userId: 'demo-user',
    title: 'Upload Images',
    showButton: false,
    showZone: true,
    messages: defaultMessages,
  },
};

export const WithStorageLimit: Story = {
  args: {
    storageAdapter,
    config: {
      maxFileSize: 500 * 1024 * 1024, // 500MB
      allowedTypes: ['pdf', 'docx', 'xlsx', 'txt', 'png', 'jpg', 'jpeg'],
      maxFiles: 5,
      orgStorageLimit: 1 * 1024 * 1024 * 1024, // 1GB org limit
      autoClose: true,
    },
    existingFiles: [],
    userId: 'demo-user',
    title: 'Upload with Limits',
    showButton: true,
    showZone: true,
    messages: defaultMessages,
  },
};

export const CustomMessages: Story = {
  args: {
    storageAdapter,
    config: {
      maxFileSize: 500 * 1024 * 1024,
      allowedTypes: ['pdf', 'docx', 'xlsx'],
      autoClose: true,
    },
    userId: 'demo-user',
    title: 'Custom Messages Demo',
    showButton: true,
    showZone: true,
    messages: {
      completed: '✅ Successfully uploaded!',
      failed: '❌ Oops! Upload failed',
      duplicated: '⚠️ This file already exists',
      exceded: '📦 File is too large',
      fileType: '🚫 File type not supported',
      orgFileSizeLimitExceeded: '💾 Storage quota exceeded',
    },
  },
};

export const LoadingState: Story = {
  render: () => {
    const mockFiles = [
      { id: '1', name: 'document.pdf', size: 2500000, type: 'application/pdf', progress: 45, status: 'uploading' as const, modified: new Date() },
      { id: '2', name: 'presentation.pptx', size: 5000000, type: 'application/vnd.ms-powerpoint', progress: 78, status: 'uploading' as const, modified: new Date() },
      { id: '3', name: 'spreadsheet.xlsx', size: 1200000, type: 'application/vnd.ms-excel', progress: 23, status: 'uploading' as const, modified: new Date() },
      { id: '4', name: 'large-file.zip', size: 800000, type: 'application/zip', progress: 0, status: 'failed' as const, modified: new Date() },
      { id: '5', name: 'image.png', size: 800000, type: 'image/png', progress: 90, status: 'uploading' as const, modified: new Date() },
    ];

    return (
      <div>
        <Typography variant="h6" sx={{ mb: 2 }}>Upload Drawer - Loading State with Failed Item</Typography>
        <UploadDrawer
          open={true}
          files={mockFiles}
          errorCount={1}
          onClose={() => {}}
          title="Uploading Files"
          closeButtonText="Close"
          errorMessage="files failed to upload"
          messages={defaultMessages}
        />
      </div>
    );
  },
};
