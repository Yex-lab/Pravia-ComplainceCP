import type { Meta, StoryObj } from '@storybook/react-vite';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ResetPasswordForm } from './reset-password-form';
import { Logo } from '../../components/data-display/logo/logo';
import type { ResetPasswordFormProps, ResetPasswordSchemaType } from './reset-password-form';

const meta: Meta<typeof ResetPasswordForm> = {
  title: 'Views/Auth/Reset Password Form',
  component: ResetPasswordForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# ResetPasswordForm

A password reset form component with email validation and customizable callbacks.

## Features

- 📧 **Email validation** - Built-in email format validation
- ⚠️ **Error handling** - Displays validation and submission errors
- 🔗 **Navigation callbacks** - Customizable back to sign in link
- 🎨 **Customizable text** - All text labels can be customized
- 🖼️ **Logo support** - Optional logo display

## Usage

\`\`\`tsx
import { ResetPasswordForm } from '@asyml8/ui';

function MyResetPasswordPage() {
  const handleResetPassword = async (data) => {
    // Your password reset logic here
    console.log('Reset password for:', data.email);
  };

  return (
    <ResetPasswordForm
      onSubmit={handleResetPassword}
      onBackToSignIn={() => router.push('/signin')}
    />
  );
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Form title',
    },
    submitText: {
      control: 'text',
      description: 'Submit button text',
    },
    loadingText: {
      control: 'text',
      description: 'Loading button text',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ResetPasswordForm>;

export const Default: Story = {
  render: (args) => {
    const handleSubmit = async (data: ResetPasswordSchemaType) => {
      console.log('Reset password data:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    };

    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <ResetPasswordForm
            {...args}
            onSubmit={handleSubmit}
            onBackToSignIn={() => console.log('Back to sign in clicked')}
          />
        </CardContent>
      </Card>
    );
  },
};

export const WithLogo: Story = {
  render: () => {
    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <ResetPasswordForm
            logo={<Logo isSingle={false} />}
            onSubmit={async (data) => console.log(data)}
            onBackToSignIn={() => console.log('Back to sign in clicked')}
          />
        </CardContent>
      </Card>
    );
  },
};

export const CustomText: Story = {
  render: () => {
    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <ResetPasswordForm
            title="Reset Your Password"
            description="Enter your email address and we'll send you instructions to reset your password."
            submitText="Send Instructions"
            loadingText="Sending..."
            backLinkText="← Back to Login"
            onSubmit={async (data) => console.log(data)}
            onBackToSignIn={() => console.log('Back to sign in clicked')}
          />
        </CardContent>
      </Card>
    );
  },
};

export const WithoutBackLink: Story = {
  render: () => {
    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <ResetPasswordForm
            onSubmit={async (data) => console.log(data)}
          />
        </CardContent>
      </Card>
    );
  },
};
