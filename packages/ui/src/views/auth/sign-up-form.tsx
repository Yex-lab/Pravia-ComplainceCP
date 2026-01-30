'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { FormHead } from './form-head';
import { Form, Field, schemaUtils } from '../../components/inputs/hook-form';
import { Iconify } from '../../components/data-display/iconify';

// ----------------------------------------------------------------------

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export const SignUpSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required!' }),
  lastName: z.string().min(1, { message: 'Last name is required!' }),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export interface SignUpFormProps {
  title?: string;
  description?: React.ReactNode;
  logo?: React.ReactNode;
  centered?: boolean;
  showDivider?: boolean;
  onSubmit: (data: SignUpSchemaType) => Promise<void>;
  onSignIn?: () => void;
  signInText?: string;
  submitText?: string;
  loadingText?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  termsComponent?: React.ReactNode;
  passwordVisibleIcon?: React.ReactNode;
  passwordHiddenIcon?: React.ReactNode;
  // Configurable text
  firstNameLabel?: string;
  lastNameLabel?: string;
  emailLabel?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  haveAccountText?: string;
  errorMessage?: string;
}

export function SignUpForm({
  title = "Get started absolutely free",
  description,
  logo,
  centered = true,
  showDivider = true,
  onSubmit,
  onSignIn,
  signInText = "Sign in",
  submitText = "Create account",
  loadingText = "Create account...",
  showPassword = false,
  onTogglePassword,
  termsComponent,
  passwordVisibleIcon = '👁️',
  passwordHiddenIcon = '👁️‍🗨️',
}: SignUpFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignUpSchemaType = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleFormSubmit = async (data: SignUpSchemaType) => {
    try {
      setErrorMessage(null);
      await onSubmit(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Field.Text
          name="firstName"
          label="First name"
          autoFocus
          slotProps={{ 
            inputLabel: { shrink: true },
            input: { autoComplete: 'given-name' }
          }}
        />
        <Field.Text
          name="lastName"
          label="Last name"
          slotProps={{ 
            inputLabel: { shrink: true },
            input: { autoComplete: 'family-name' }
          }}
        />
      </Box>

      <Field.Text
        name="email"
        label="Email address"
        type="email"
        slotProps={{ 
          inputLabel: { shrink: true },
          input: { autoComplete: 'email' }
        }}
      />

      <Field.Text
        name="password"
        label="Password"
        placeholder="6+ characters"
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            autoComplete: 'new-password',
            endAdornment: onTogglePassword && (
              <InputAdornment position="end">
                <IconButton onClick={onTogglePassword} edge="end">
                  <Iconify 
                    icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} 
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        sx={{ textTransform: 'uppercase' }}
      >
        {isSubmitting ? loadingText : submitText}
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead
        logo={logo}
        title={title}
        showDivider={showDivider}
        description={
          description || (onSignIn && (
            <>
              {`Already have an account? `}
              <Link
                component="button"
                type="button"
                onClick={onSignIn}
                variant="subtitle2"
                sx={{ textDecoration: 'none' }}
              >
                {signInText}
              </Link>
            </>
          ))
        }
        centered={centered}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={methods.handleSubmit(handleFormSubmit)}>
        {renderForm()}
      </Form>

      {termsComponent}
    </>
  );
}
