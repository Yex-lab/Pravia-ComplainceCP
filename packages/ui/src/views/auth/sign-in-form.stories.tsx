import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { SignInForm } from './sign-in-form';
import { Logo } from '../../components/data-display/logo/logo';
import type { SignInFormProps, SignInSchemaType } from './sign-in-form';

const meta: Meta<typeof SignInForm> = {
  title: 'Views/Auth/Sign In Form',
  component: SignInForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# SignInForm

A reusable sign-in form component with validation, error handling, and customizable callbacks.

## Features

- 📧 **Email validation** - Built-in email format validation
- 🔒 **Password validation** - Minimum 6 characters required
- 👁️ **Password visibility toggle** - Optional show/hide password
- ⚠️ **Error handling** - Displays validation and submission errors
- 🔗 **Navigation callbacks** - Customizable forgot password and sign up links
- 🎨 **Customizable text** - All text labels can be customized

## Usage

\`\`\`tsx
import { SignInForm } from '@asyml8/ui';

function MySignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (data) => {
    // Your sign-in logic here
    console.log('Sign in:', data);
  };

  return (
    <SignInForm
      onSubmit={handleSignIn}
      showPassword={showPassword}
      onTogglePassword={() => setShowPassword(!showPassword)}
      onForgotPassword={() => router.push('/forgot-password')}
      onSignUp={() => router.push('/sign-up')}
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
type Story = StoryObj<typeof SignInForm>;

export const Default: Story = {
  render: (args) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const handleSubmit = async (data: SignInSchemaType) => {
      console.log('Sign in data:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    };

    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <SignInForm
            {...args}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={handleSubmit}
            onForgotPassword={() => console.log('Forgot password clicked')}
            onSignUp={() => console.log('Sign up clicked')}
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
          <SignInForm
            logo={<Logo isSingle={false} />}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={async (data) => console.log(data)}
            onForgotPassword={() => console.log('Forgot password clicked')}
            onSignUp={() => console.log('Sign up clicked')}
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
          <SignInForm
            title="Welcome Back!"
            submitText="Login"
            loadingText="Logging in..."
            forgotPasswordText="Reset Password"
            signUpText="Create Account"
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={async (data) => console.log(data)}
            onForgotPassword={() => console.log('Reset password')}
            onSignUp={() => console.log('Create account')}
          />
        </CardContent>
      </Card>
    );
  },
};

export const WithoutNavigation: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <SignInForm
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={async (data) => console.log(data)}
          />
        </CardContent>
      </Card>
    );
  },
};
