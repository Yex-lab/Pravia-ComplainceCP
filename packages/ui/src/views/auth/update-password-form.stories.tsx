import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { UpdatePasswordForm } from './update-password-form';
import { Logo } from '../../components/data-display/logo/logo';
import type { UpdatePasswordFormProps, UpdatePasswordSchemaType } from './update-password-form';

const meta: Meta<typeof UpdatePasswordForm> = {
  title: 'Views/Auth/Update Password Form',
  component: UpdatePasswordForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# UpdatePasswordForm

A comprehensive password update form with email verification, 6-digit code input, and password confirmation.

## Features

- 📧 **Email field** - Editable email address
- 🔢 **6-digit code input** - Individual input boxes for verification code
- 🔒 **Password validation** - Minimum 6 characters required
- 🔄 **Password confirmation** - Ensures passwords match
- 👁️ **Password visibility toggle** - Optional show/hide password
- 🔄 **Resend functionality** - Option to resend verification code
- ⚠️ **Error handling** - Displays validation and submission errors
- 🎨 **Customizable text** - All text labels can be customized
- 🖼️ **Logo support** - Optional logo display

## Usage

\`\`\`tsx
import { UpdatePasswordForm } from '@asyml8/ui';

function MyUpdatePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdatePassword = async (data) => {
    // Your password update logic here
    console.log('Update password:', data);
  };

  const handleResend = async (email) => {
    // Your resend logic here
    console.log('Resend code to:', email);
  };

  return (
    <UpdatePasswordForm
      email="user@example.com"
      onSubmit={handleUpdatePassword}
      onResendCode={handleResend}
      showPassword={showPassword}
      onTogglePassword={() => setShowPassword(!showPassword)}
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
    showPassword: {
      control: 'boolean',
      description: 'Whether password is visible',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UpdatePasswordForm>;

export const Default: Story = {
  render: (args) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const handleSubmit = async (data: UpdatePasswordSchemaType) => {
      console.log('Update password data:', data);
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
          <UpdatePasswordForm
            {...args}
            email="user@example.com"
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
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
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <UpdatePasswordForm
            logo={<Logo isSingle={false} />}
            email="user@example.com"
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
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
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <UpdatePasswordForm
            title="Create New Password"
            description="Your new password must be different from your previous password."
            submitText="Save Password"
            loadingText="Saving..."
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={async (data) => console.log(data)}
          />
        </CardContent>
      </Card>
    );
  },
};

export const WithoutToggle: Story = {
  render: () => {
    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <UpdatePasswordForm
            onSubmit={async (data) => console.log(data)}
          />
        </CardContent>
      </Card>
    );
  },
};

export const PasswordOnly: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <UpdatePasswordForm
            title="Update Password"
            description="Enter your new password below."
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={async (data) => console.log(data)}
            onBackToSignIn={() => console.log('Back to sign in clicked')}
          />
        </CardContent>
      </Card>
    );
  },
};

export const WithEmailField: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <UpdatePasswordForm
            title="Update Password"
            description="Enter your email and new password below."
            showEmailField={true}
            email="user@example.com"
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={async (data) => console.log(data)}
            onBackToSignIn={() => console.log('Back to sign in clicked')}
          />
        </CardContent>
      </Card>
    );
  },
};

export const WithOtpField: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <UpdatePasswordForm
            title="Request sent successfully!"
            description="We've sent a 6-digit confirmation email to your email. Please enter the code in below box to verify your email."
            showOtpField={true}
            email="user@example.com"
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={async (data) => console.log(data)}
            onResendCode={async (email) => console.log('Resend to:', email)}
            onBackToSignIn={() => console.log('Back to sign in clicked')}
          />
        </CardContent>
      </Card>
    );
  },
};

export const FullForm: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <UpdatePasswordForm
            title="Complete Password Update"
            description="Enter your email, verification code, and new password."
            showEmailField={true}
            showOtpField={true}
            email="user@example.com"
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={async (data) => console.log(data)}
            onResendCode={async (email) => console.log('Resend to:', email)}
            onBackToSignIn={() => console.log('Back to sign in clicked')}
          />
        </CardContent>
      </Card>
    );
  },
};
