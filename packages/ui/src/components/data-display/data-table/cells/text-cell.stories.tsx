import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent } from '@mui/material';
import { TextCell } from './text-cell';

const meta: Meta<typeof TextCell> = {
  title: 'Data Display/Data Table/Cells/Text Cell',
  component: TextCell,
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
} satisfies Meta<typeof TextCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'Sample text content',
  },
};

export const WithFallback: Story = {
  args: {
    value: null,
    fallback: 'No data available',
  },
};

export const LongText: Story = {
  args: {
    value: 'This is a very long text that might need to be truncated or wrapped depending on the cell width and styling',
  },
};
