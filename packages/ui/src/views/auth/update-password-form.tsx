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
import Typography from '@mui/material/Typography';

import { FormHead } from './form-head';
import { Form, Field, schemaUtils } from '../../components/inputs/hook-form';
import { Iconify } from '../../components/data-display/iconify';

// ----------------------------------------------------------------------

export type UpdatePasswordSchemaType = z.infer<typeof UpdatePasswordSchema>;

export const UpdatePasswordSchema = z
  .object({
    email: z.string().email('Invalid email address').optional(),
    code: z.string().min(6, 'Code must be 6 digits').max(6, 'Code must be 6 digits').optional(),
    password: z
      .string()
      .min(1, { message: 'Password is required!' })
      .min(6, { message: 'Password must be at least 6 characters!' }),
    confirmPassword: z.string().min(1, { message: 'Confirm password is required!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export interface UpdatePasswordFormProps {
  title?: string;
  description?: React.ReactNode;
  logo?: React.ReactNode;
  centered?: boolean;
  showDivider?: boolean;
  email?: string;
  onSubmit: (data: UpdatePasswordSchemaType) => Promise<void>;
  onResendCode?: (email: string) => Promise<void>;
  onBackToSignIn?: () => void;
  submitText?: string;
  loadingText?: string;
  resendText?: string;
  backLinkText?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  passwordVisibleIcon?: React.ReactNode;
  passwordHiddenIcon?: React.ReactNode;
  showEmailField?: boolean;
  showOtpField?: boolean;
  // Configurable text
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  passwordHelperText?: string;
  confirmPasswordLabel?: string;
  confirmPasswordPlaceholder?: string;
  confirmPasswordHelperText?: string;
  // Configurable validation
  passwordMinLength?: number;
}

export function UpdatePasswordForm({
  title = "Update password",
  description = "Enter your new password below.",
  logo,
  centered = true,
  showDivider = true,
  email = '',
  onSubmit,
  onResendCode,
  onBackToSignIn,
  submitText = "Update password",
  loadingText = "Update password...",
  resendText = "Resend",
  backLinkText = "Return to sign in",
  showPassword = false,
  onTogglePassword,
  passwordVisibleIcon = '👁️',
  passwordHiddenIcon = '👁️🗨️',
  showEmailField = false,
  showOtpField = false,
  emailLabel = "Email address",
  emailPlaceholder = "example@gmail.com",
  passwordLabel = "Password",
  passwordPlaceholder = "6+ characters",
  passwordHelperText = "Must be at least 6 characters",
  confirmPasswordLabel = "Confirm new password",
  confirmPasswordPlaceholder = "6+ characters",
  confirmPasswordHelperText = "Re-enter your password",
  passwordMinLength = 6,
}: UpdatePasswordFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const schema = z
    .object({
      email: z.string().email('Invalid email address').or(z.literal('')).optional(),
      code: z.string().length(6, 'Code must be 6 digits').or(z.literal('')).optional(),
      password: z
        .string()
        .min(1, { message: 'Password is required!' })
        .min(passwordMinLength, { message: `Password must be at least ${passwordMinLength} characters!` }),
      confirmPassword: z.string().min(1, { message: 'Confirm password is required!' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });

  const defaultValues: UpdatePasswordSchemaType = {
    email,
    code: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onSubmit',
  });

  const {
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const watchedEmail = watch('email');

  console.log('UpdatePasswordForm: Creating handleFormSubmit');
  const handleFormSubmit = handleSubmit(async (data) => {
    console.log('[2] UpdatePasswordForm: handleFormSubmit called', data);
    console.log('[3] Form errors:', errors);
    console.log('[4] Is submitting:', isSubmitting);
    try {
      setErrorMessage(null);
      console.log('[5] Calling onSubmit with data:', data);
      await onSubmit(data);
      console.log('[6] onSubmit completed successfully');
    } catch (error) {
      console.error('[7] onSubmit error', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  });

  const handleResendCode = async () => {
    if (!onResendCode || !watchedEmail) return;
    try {
      setIsResending(true);
      setErrorMessage(null);
      await onResendCode(watchedEmail);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  const renderCodeInput = () => {
    return (
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <Field.Text
            key={index}
            autoFocus={index === 0}
            inputProps={{
              maxLength: 1,
              style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' },
            }}
            sx={{
              width: 56,
              height: 56,
              '& .MuiOutlinedInput-root': {
                height: 56,
              },
            }}
            onChange={(e) => {
              const value = e.target.value;
              if (value.match(/^[0-9]$/)) {
                const currentCode = watch('code') || '';
                const newCode = currentCode.split('');
                newCode[index] = value;
                methods.setValue('code', newCode.join(''));
                
                // Auto-focus next input
                if (index < 5) {
                  const nextInput = document.querySelector(`input[name="code-${index + 1}"
        slotProps={{ inputLabel: { shrink: true } }}]`) as HTMLInputElement;
                  nextInput?.focus();
                }
              }
            }}
            name={`code-${index}`}
            value={(watch('code') || '')[index] || ''}
          />
        ))}
      </Box>
    );
  };

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      {showEmailField && (
        <Field.Text
          name="email"
          slotProps={{ 
            inputLabel: { shrink: true },
            input: { autoComplete: 'email' }
          }}
          label={emailLabel}
          type="email"
          placeholder={emailPlaceholder}
        />
      )}

      {showOtpField && renderCodeInput()}

      <Field.Text
        name="password"
        label={passwordLabel}
        placeholder={passwordPlaceholder}
        type={showPassword ? 'text' : 'password'}
        helperText={passwordHelperText}
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

      <Field.Text
        name="confirmPassword"
        label={confirmPasswordLabel}
        placeholder={confirmPasswordPlaceholder}
        type={showPassword ? 'text' : 'password'}
        helperText={confirmPasswordHelperText}
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
        size="large"
        type="submit"
        variant="contained"
        disabled={isSubmitting || (showOtpField && (watch('code') || '').length !== 6)}
        sx={{ textTransform: 'uppercase' }}
        onClick={(e) => {
          console.log('[1] Button onClick fired');
          console.log('[1a] Form values:', methods.getValues());
          console.log('[1b] Form errors:', methods.formState.errors);
          console.log('[1c] Form isValid:', methods.formState.isValid);
          e.preventDefault();
          handleFormSubmit(e as any);
        }}
      >
        {isSubmitting ? loadingText : submitText}
      </Button>

      {onResendCode && showOtpField && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Don't have a code?{' '}
            <Link
              component="button"
              type="button"
              onClick={handleResendCode}
              disabled={isResending || !watchedEmail}
              sx={{ textDecoration: 'none' }}
            >
              {isResending ? 'Sending...' : resendText}
            </Link>
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <FormHead
        logo={logo}
        title={title}
        description={description}
        centered={centered}
        showDivider={showDivider}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={handleFormSubmit}>
        {renderForm()}
      </Form>

      {onBackToSignIn && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link
            component="button"
            type="button"
            onClick={onBackToSignIn}
            variant="body2"
            sx={{ textDecoration: 'none' }}
          >
            ← {backLinkText}
          </Link>
        </Box>
      )}
    </>
  );
}
