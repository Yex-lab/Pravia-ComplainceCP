import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent } from '@mui/material';
import { DateCell } from './date-cell';

const meta: Meta<typeof DateCell> = {
  title: 'Data Display/Data Table/Cells/Date Cell',
  component: DateCell,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story: any) => (
      <Card sx={{ width: 420 }}>
        <CardContent>
          <Story />
        </CardContent>
      </Card>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof DateCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: new Date('2024-03-15T10:30:00Z'),
  },
};

export const WithFormat: Story = {
  args: {
    value: new Date('2024-03-15T10:30:00Z'),
    format: 'date',
  },
};

export const WithTime: Story = {
  args: {
    value: new Date('2024-03-15T10:30:00Z'),
    format: 'datetime',
  },
};

export const Relative: Story = {
  args: {
    value: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    format: 'relative',
  },
};

export const WithFallback: Story = {
  args: {
    value: undefined,
    fallback: 'No date set',
  },
};
