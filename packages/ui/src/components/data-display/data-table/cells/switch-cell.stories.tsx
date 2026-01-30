import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent } from '@mui/material';
import { SwitchCell } from './switch-cell';

const meta: Meta<typeof SwitchCell> = {
  title: 'Data Display/Data Table/Cells/Switch Cell',
  component: SwitchCell,
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
} satisfies Meta<typeof SwitchCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: true,
    onChange: (checked: boolean) => console.log('Switch changed:', checked),
  },
};

export const Unchecked: Story = {
  args: {
    checked: false,
    onChange: (checked: boolean) => console.log('Switch changed:', checked),
  },
};

export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
    onChange: (checked: boolean) => console.log('Switch changed:', checked),
  },
};

export const WithColor: Story = {
  args: {
    checked: true,
    onChange: (checked: boolean) => console.log('Switch changed:', checked),
  },
};
