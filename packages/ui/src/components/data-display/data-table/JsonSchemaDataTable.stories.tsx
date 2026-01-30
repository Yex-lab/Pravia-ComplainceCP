import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Data Display/Data Table/JSON Schema',
  parameters: {
    docs: {
      description: {
        component: 'Temporarily disabled for build issues',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Disabled: Story = {
  render: () => <div>Temporarily disabled for build issues</div>,
};
