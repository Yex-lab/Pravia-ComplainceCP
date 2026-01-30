'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { FormHead } from './form-head';
import { Form, Field, schemaUtils } from '../../components/inputs/hook-form';

// ----------------------------------------------------------------------

export type VerifyEmailSchemaType = z.infer<typeof VerifyEmailSchema>;

export const VerifyEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().min(6, 'Code must be 6 digits').max(6, 'Code must be 6 digits'),
});

// ----------------------------------------------------------------------

export interface VerifyEmailFormProps {
  title?: string;
  description?: React.ReactNode;
  logo?: React.ReactNode;
  centered?: boolean;
  email?: string;
  onSubmit?: (data: VerifyEmailSchemaType) => Promise<void>;
  onResendCode?: (emailAddress: string) => Promise<void>;
  onBackToSignIn?: () => void;
  submitText?: string;
  loadingText?: string;
  resendText?: string;
  backLinkText?: string;
}

export function VerifyEmailForm({
  title = "Please check your email!",
  description = "We've emailed a 6-digit confirmation code.\nPlease enter the code in the box below to verify your email.",
  logo,
  centered = true,
  email = '',
  onSubmit,
  onResendCode,
  onBackToSignIn,
  submitText = "Verify",
  loadingText = "Verifying...",
  resendText = "Resend",
  backLinkText = "Return to sign in",
}: VerifyEmailFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const defaultValues: VerifyEmailSchemaType = {
    email,
    code: '',
  };

  const methods = useForm({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const watchedEmail = watch('email');

  const handleFormSubmit = async (data: any) => {
    if (!onSubmit) return;
    try {
      setErrorMessage(null);
      await onSubmit(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

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
    const [code1, code2, code3, code4, code5, code6] = watch('code').split('');
    
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
                const currentCode = watch('code');
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
            value={watch('code')[index] || ''}
          />
        ))}
      </Box>
    );
  };

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      {email ? (
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold',
            textDecoration: 'underline',
            color: 'primary.main',
            textAlign: 'center',
          }}
        >
          {email}
        </Typography>
      ) : (
        <Field.Text
          name="email"
          slotProps={{ inputLabel: { shrink: true } }}
          label="Email address"
          type="email"
          placeholder="example@gmail.com"
        />
      )}

      {renderCodeInput()}

      {onSubmit && (
        <Button
          size="large"
          type="submit"
          variant="contained"
          disabled={isSubmitting || watch('code').length !== 6}
          sx={{ textTransform: 'uppercase' }}
        >
          {isSubmitting ? loadingText : submitText}
        </Button>
      )}

      {onResendCode && (
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
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={methods.handleSubmit(handleFormSubmit)}>
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
            {backLinkText}
          </Link>
        </Box>
      )}
    </>
  );
}
