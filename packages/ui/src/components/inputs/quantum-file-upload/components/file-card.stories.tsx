import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@mui/material';
import { FileCard } from './file-card';
import type { FileDetail } from '../../../../types/quantum-file-upload';

const meta = {
  title: 'Inputs/FileCard',
  component: FileCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockFile: FileDetail = {
  id: '1',
  name: 'diagram-export-11-19-2025-1_2025-11-19.drawio',
  size: 163840, // 160 KB
  type: 'application/pdf',
  progress: 75,
  status: 'uploading',
  statusMessage: 'Uploading...',
};

const completedFile: FileDetail = {
  ...mockFile,
  progress: 100,
  status: 'completed',
  statusMessage: 'Completed',
};

const imageFile: FileDetail = {
  id: '2',
  name: 'screenshot-2025.png',
  size: 2048000, // 2 MB
  type: 'image/png',
  progress: 100,
  status: 'completed',
  statusMessage: 'Completed',
};

const failedFile: FileDetail = {
  id: '3',
  name: 'corrupted-file.pdf',
  size: 512000,
  type: 'application/pdf',
  progress: 45,
  status: 'failed',
  statusMessage: 'Error',
};

const processingFile: FileDetail = {
  id: '4',
  name: 'processing-document.pdf',
  size: 1024000,
  type: 'application/pdf',
  progress: 80,
  status: 'processing',
  statusMessage: 'Processing...',
};

export const Default: Story = {
  args: {
    file: mockFile,
    onDownload: (file) => console.log('Download:', file.name),
    onDelete: (file) => console.log('Delete:', file.name),
  },
};

export const Uploading: Story = {
  args: {
    file: mockFile,
    onDelete: (file) => console.log('Cancel:', file.name),
  },
};

export const Processing: Story = {
  args: {
    file: processingFile,
    onDelete: (file) => console.log('Delete:', file.name),
  },
};

export const Completed: Story = {
  args: {
    file: completedFile,
    onDownload: (file) => console.log('Download:', file.name),
    onDelete: (file) => console.log('Delete:', file.name),
  },
};

export const ImageFile: Story = {
  args: {
    file: imageFile,
    onDownload: (file) => console.log('Download:', file.name),
    onDelete: (file) => console.log('Delete:', file.name),
  },
};

export const Failed: Story = {
  args: {
    file: failedFile,
    onDelete: (file) => console.log('Delete:', file.name),
  },
};

export const Small: Story = {
  args: {
    file: completedFile,
    styleConfig: {
      size: 'small',
    },
    onDownload: (file) => console.log('Download:', file.name),
    onDelete: (file) => console.log('Delete:', file.name),
  },
};

export const Large: Story = {
  args: {
    file: completedFile,
    styleConfig: {
      size: 'large',
    },
    onDownload: (file) => console.log('Download:', file.name),
    onDelete: (file) => console.log('Delete:', file.name),
  },
};

export const CustomColors: Story = {
  args: {
    file: completedFile,
    styleConfig: {
      colors: {
        background: 'rgba(33, 150, 243, 0.1)',
        hoverBackground: 'rgba(33, 150, 243, 0.2)',
        border: 'rgba(33, 150, 243, 0.3)',
        progressBar: '#2196F3',
      },
    },
    onDownload: (file) => console.log('Download:', file.name),
    onDelete: (file) => console.log('Delete:', file.name),
  },
};

export const NoActions: Story = {
  args: {
    file: completedFile,
    styleConfig: {
      actions: {
        show: false,
      },
    },
  },
};

export const FileList: Story = {
  render: () => (
    <Stack spacing={1.5} sx={{ width: 500 }}>
      <FileCard
        file={mockFile}
        onDownload={(file) => console.log('Download:', file.name)}
        onDelete={(file) => console.log('Delete:', file.name)}
      />
      <FileCard
        file={completedFile}
        onDownload={(file) => console.log('Download:', file.name)}
        onDelete={(file) => console.log('Delete:', file.name)}
      />
      <FileCard
        file={imageFile}
        onDownload={(file) => console.log('Download:', file.name)}
        onDelete={(file) => console.log('Delete:', file.name)}
      />
      <FileCard
        file={failedFile}
        onDelete={(file) => console.log('Delete:', file.name)}
      />
    </Stack>
  ),
};
