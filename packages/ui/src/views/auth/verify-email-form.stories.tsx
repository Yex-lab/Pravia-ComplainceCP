import type { Meta, StoryObj } from '@storybook/react-vite';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { VerifyEmailForm } from './verify-email-form';
import { Logo } from '../../components/data-display/logo/logo';
import type { VerifyEmailFormProps, VerifyEmailSchemaType } from './verify-email-form';

const meta: Meta<typeof VerifyEmailForm> = {
  title: 'Views/Auth/Verify Email Form',
  component: VerifyEmailForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# VerifyEmailForm

An email verification form with 6-digit code input, email field, and resend functionality.

## Features

- 📧 **Email field** - Editable email address
- 🔢 **6-digit code input** - Individual input boxes for each digit
- 🔄 **Resend functionality** - Option to resend verification code
- ⚠️ **Error handling** - Displays validation and submission errors
- 🎨 **Customizable text** - All text content can be customized
- 🖼️ **Logo support** - Optional logo display

## Usage

\`\`\`tsx
import { VerifyEmailForm } from '@asyml8/ui';

function MyVerifyEmailPage() {
  const handleVerify = async (data) => {
    // Your verification logic here
    console.log('Verify:', data.email, data.code);
  };

  const handleResend = async (email) => {
    // Your resend logic here
    console.log('Resend code to:', email);
  };

  return (
    <VerifyEmailForm
      email="user@example.com"
      onSubmit={handleVerify}
      onResendCode={handleResend}
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
    email: {
      control: 'text',
      description: 'Pre-filled email address',
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
type Story = StoryObj<typeof VerifyEmailForm>;

export const Default: Story = {
  render: (args) => {
    const handleSubmit = async (data: VerifyEmailSchemaType) => {
      console.log('Verify data:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const handleResend = async (email: string) => {
      console.log('Resend code to:', email);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    };

    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <VerifyEmailForm
            {...args}
            email="user@example.com"
            onSubmit={handleSubmit}
            onResendCode={handleResend}
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
          <VerifyEmailForm
            logo={<Logo isSingle={false} />}
            email="user@example.com"
            onSubmit={async (data) => console.log(data)}
            onResendCode={async (email) => console.log('Resend to:', email)}
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
          <VerifyEmailForm
            title="Verify Your Account"
            description="Enter the 6-digit verification code we sent to your email address."
            email="user@example.com"
            submitText="Confirm"
            loadingText="Confirming..."
            resendText="Send Again"
            backLinkText="← Back to Login"
            onSubmit={async (data) => console.log(data)}
            onResendCode={async (email) => console.log('Resend to:', email)}
            onBackToSignIn={() => console.log('Back to sign in clicked')}
          />
        </CardContent>
      </Card>
    );
  },
};

export const MessageOnly: Story = {
  render: () => {
    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <VerifyEmailForm
            onBackToSignIn={() => console.log('Back to sign in clicked')}
          />
        </CardContent>
      </Card>
    );
  },
};

export const WithoutResend: Story = {
  render: () => {
    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <VerifyEmailForm
            email="user@example.com"
            onSubmit={async (data) => console.log(data)}
            onBackToSignIn={() => console.log('Back to sign in clicked')}
          />
        </CardContent>
      </Card>
    );
  },
};
