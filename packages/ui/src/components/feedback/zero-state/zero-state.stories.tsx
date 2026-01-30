import type { Meta, StoryObj } from '@storybook/react';
import { ZeroState } from './zero-state';

const meta = {
  title: 'Feedback/ZeroState',
  component: ZeroState,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ZeroState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No Data Available',
    description: 'There is currently no data to display. Try adjusting your filters or check back later.',
  },
};

export const WithAction: Story = {
  args: {
    title: 'No Items Found',
    description: 'Get started by creating your first item.',
    action: {
      label: 'Create Item',
      onClick: () => alert('Create clicked'),
    },
  },
};

export const UserNotFound: Story = {
  args: {
    icon: 'solar:user-cross-bold-duotone',
    title: 'User Not Found',
    description: "The user profile you're looking for doesn't exist or may have been removed.",
  },
};

export const EmptyInbox: Story = {
  args: {
    icon: 'solar:inbox-line-bold-duotone',
    title: 'Inbox Empty',
    description: 'You have no new messages. Enjoy your day!',
  },
};

export const NoResults: Story = {
  args: {
    icon: 'solar:magnifer-bold-duotone',
    title: 'No Results Found',
    description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
    action: {
      label: 'Clear Filters',
      onClick: () => alert('Filters cleared'),
    },
  },
};

export const NoConnection: Story = {
  args: {
    icon: 'solar:wifi-router-minimalistic-bold-duotone',
    title: 'No Connection',
    description: 'Unable to connect to the server. Please check your internet connection and try again.',
    action: {
      label: 'Retry',
      onClick: () => alert('Retrying...'),
    },
  },
};
