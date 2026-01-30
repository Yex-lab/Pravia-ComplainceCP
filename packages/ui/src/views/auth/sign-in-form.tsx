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

export type SignInSchemaType = z.infer<typeof SignInSchema>;

export const SignInSchema = z.object({
  email: schemaUtils.email(),
  password: z
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export interface SignInFormProps {
  title?: string;
  description?: React.ReactNode;
  logo?: React.ReactNode;
  showDivider?: boolean;
  onSubmit: (data: SignInSchemaType) => Promise<void>;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  forgotPasswordText?: string;
  signUpText?: string;
  submitText?: string;
  loadingText?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  passwordVisibleIcon?: React.ReactNode;
  passwordHiddenIcon?: React.ReactNode;
  defaultValues?: Partial<SignInSchemaType>;
  // Configurable text
  emailLabel?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  noAccountText?: string;
  errorMessage?: string;
}

export function SignInForm({
  title = "Sign in to your account",
  description,
  logo,
  showDivider = true,
  onSubmit,
  onForgotPassword,
  onSignUp,
  forgotPasswordText = "Forgot password?",
  signUpText = "Get started",
  submitText = "Sign in",
  loadingText = "Sign in...",
  showPassword = false,
  onTogglePassword,
  passwordVisibleIcon = '👁️',
  passwordHiddenIcon = '👁️🗨️',
  defaultValues,
  emailLabel = "Email address",
  passwordLabel = "Password",
  passwordPlaceholder = "6+ characters",
  noAccountText = "Don't have an account? ",
  errorMessage = "An error occurred",
}: SignInFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formDefaultValues: SignInSchemaType = {
    email: '',
    password: '',
    ...defaultValues,
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: formDefaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg(null);
      await onSubmit(data);
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : errorMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text 
        name="email" 
        label={emailLabel}
        autoFocus
        slotProps={{ 
          inputLabel: { shrink: true },
          input: { autoComplete: 'email' }
        }} 
      />

      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
        {onForgotPassword && (
          <Link
            component="button"
            type="button"
            onClick={onForgotPassword}
            variant="body2"
            color="inherit"
            sx={{ alignSelf: 'flex-end', textDecoration: 'none' }}
          >
            {forgotPasswordText}
          </Link>
        )}

        <Field.Text
          name="password"
          label={passwordLabel}
          placeholder={passwordPlaceholder}
          type={showPassword ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              autoComplete: 'current-password',
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
      </Box>

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={loadingText}
        sx={{ textTransform: 'uppercase' }}
      >
        {submitText}
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
          description || (onSignUp && (
            <>
              {noAccountText}
              <Link
                component="button"
                type="button"
                onClick={onSignUp}
                variant="subtitle2"
                sx={{ textDecoration: 'none' }}
              >
                {signUpText}
              </Link>
            </>
          ))
        }
      />

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={handleFormSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}
