import type { Meta, StoryObj } from '@storybook/react-vite';
import { AvatarNameCell } from './avatar-name-cell';

const meta: Meta<typeof AvatarNameCell> = {
  title: 'Data Display/Data Table/Cells/Avatar Name Cell',
  component: AvatarNameCell,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'John Doe',
  },
};

export const WithClickHandler: Story = {
  args: {
    name: 'Jane Smith',
  },
};

export const WithHref: Story = {
  args: {
    name: 'Bob Johnson',
    href: '/users/bob-johnson',
  },
};

export const WithAvatarImage: Story = {
  args: {
    name: 'Alice Brown',
    avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
  },
};

export const LongName: Story = {
  args: {
    name: 'Christopher Alexander Montgomery Wellington III',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 250, border: '1px solid #ccc', padding: 8 }}>
        <Story />
      </div>
    ),
  ],
};

export const NoEmail: Story = {
  args: {
    name: 'System User',
  },
};

export const ShortName: Story = {
  args: {
    name: 'X',
  },
};