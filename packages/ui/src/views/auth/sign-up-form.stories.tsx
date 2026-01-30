import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { SignUpForm } from './sign-up-form';
import { Logo } from '../../components/data-display/logo/logo';
import type { SignUpFormProps, SignUpSchemaType } from './sign-up-form';

const meta: Meta<typeof SignUpForm> = {
  title: 'Views/Auth/Sign Up Form',
  component: SignUpForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# SignUpForm

A reusable sign-up form component with validation, error handling, and customizable callbacks.

## Features

- 📝 **Name fields** - First and last name validation
- 📧 **Email validation** - Built-in email format validation
- 🔒 **Password validation** - Minimum 6 characters required
- 👁️ **Password visibility toggle** - Optional show/hide password
- ⚠️ **Error handling** - Displays validation and submission errors
- 🔗 **Navigation callbacks** - Customizable sign in link
- 🎨 **Customizable text** - All text labels can be customized
- 📋 **Terms component** - Optional terms and conditions

## Usage

\`\`\`tsx
import { SignUpForm } from '@asyml8/ui';

function MySignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (data) => {
    // Your sign-up logic here
    console.log('Sign up:', data);
  };

  return (
    <SignUpForm
      onSubmit={handleSignUp}
      showPassword={showPassword}
      onTogglePassword={() => setShowPassword(!showPassword)}
      onSignIn={() => router.push('/signin')}
      termsComponent={<TermsAndConditions />}
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
type Story = StoryObj<typeof SignUpForm>;

export const Default: Story = {
  render: (args) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const handleSubmit = async (data: SignUpSchemaType) => {
      console.log('Sign up data:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
    };

    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <SignUpForm
            {...args}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={handleSubmit}
            onSignIn={() => console.log('Sign in clicked')}
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
          <SignUpForm
            logo={<Logo isSingle={false} />}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={async (data) => console.log(data)}
            onSignIn={() => console.log('Sign in clicked')}
          />
        </CardContent>
      </Card>
    );
  },
};

export const WithTerms: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    
    const termsComponent = (
      <Typography variant="caption" sx={{ mt: 2, display: 'block', textAlign: 'center', color: 'text.secondary' }}>
        By signing up, you agree to our{' '}
        <Link href="#" underline="hover">Terms of Service</Link>
        {' '}and{' '}
        <Link href="#" underline="hover">Privacy Policy</Link>
      </Typography>
    );
    
    return (
      <Card sx={{ width: 420, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <SignUpForm
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={async (data) => console.log(data)}
            onSignIn={() => console.log('Sign in clicked')}
            termsComponent={termsComponent}
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
          <SignUpForm
            title="Join Our Platform"
            submitText="Create My Account"
            loadingText="Creating account..."
            signInText="Already a member?"
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={async (data) => console.log(data)}
            onSignIn={() => console.log('Sign in clicked')}
          />
        </CardContent>
      </Card>
    );
  },
};
