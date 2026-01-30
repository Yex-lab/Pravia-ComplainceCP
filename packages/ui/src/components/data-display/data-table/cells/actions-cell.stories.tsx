import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionsCell } from './actions-cell';

const meta: Meta<typeof ActionsCell> = {
  title: 'Data Display/Data Table/Cells/Actions Cell',
  component: ActionsCell,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    actions: [
      {
        label: 'Edit',
        icon: '✏️',
        onClick: () => alert('Edit clicked'),
      },
      {
        label: 'Delete',
        icon: '🗑️',
        onClick: () => alert('Delete clicked'),
        color: 'error',
      },
    ],
  },
};

export const WithManyActions: Story = {
  args: {
    actions: [
      {
        label: 'View Details',
        icon: '👁️',
        onClick: () => alert('View clicked'),
      },
      {
        label: 'Edit',
        icon: '✏️',
        onClick: () => alert('Edit clicked'),
      },
      {
        label: 'Duplicate',
        icon: '📋',
        onClick: () => alert('Duplicate clicked'),
      },
      {
        label: 'Archive',
        icon: '📦',
        onClick: () => alert('Archive clicked'),
      },
      {
        label: 'Delete',
        icon: '🗑️',
        onClick: () => alert('Delete clicked'),
        color: 'error',
      },
    ],
  },
};

export const WithDisabledActions: Story = {
  args: {
    actions: [
      {
        label: 'Edit',
        icon: '✏️',
        onClick: () => alert('Edit clicked'),
      },
      {
        label: 'Delete (Disabled)',
        icon: '🗑️',
        onClick: () => alert('Delete clicked'),
        color: 'error',
        disabled: true,
      },
    ],
  },
};