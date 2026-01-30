import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent } from '@mui/material';
import { ChipCell } from './chip-cell';

const meta: Meta<typeof ChipCell> = {
  title: 'Data Display/Data Table/Cells/Chip Cell',
  component: ChipCell,
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
} satisfies Meta<typeof ChipCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'Active',
  },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <ChipCell value="Default" color="default" />
      <ChipCell value="Primary" color="primary" />
      <ChipCell value="Secondary" color="secondary" />
      <ChipCell value="Success" color="success" />
      <ChipCell value="Warning" color="warning" />
      <ChipCell value="Error" color="error" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <ChipCell value="Filled" variant="filled" color="primary" />
      <ChipCell value="Outlined" variant="outlined" color="primary" />
    </div>
  ),
};

export const WithFallback: Story = {
  args: {
    value: '',
    fallback: 'No Status',
  },
};
