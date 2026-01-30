'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { FormHead } from './form-head';
import { Form, Field } from '../../components/inputs/hook-form';

// ----------------------------------------------------------------------

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

export const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// ----------------------------------------------------------------------

export interface ResetPasswordFormProps {
  title?: string;
  description?: React.ReactNode;
  logo?: React.ReactNode;
  centered?: boolean;
  showDivider?: boolean;
  onSubmit: (data: ResetPasswordSchemaType) => Promise<void>;
  onBackToSignIn?: () => void;
  submitText?: string;
  loadingText?: string;
  backLinkText?: string;
}

export function ResetPasswordForm({
  title = "Forgot your password?",
  description = "Please enter the email address associated with your account and we'll email you a link to reset your password.",
  logo,
  centered = true,
  showDivider = true,
  onSubmit,
  onBackToSignIn,
  submitText = "Send request",
  loadingText = "Send request...",
  backLinkText = "Return to sign in",
}: ResetPasswordFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: ResetPasswordSchemaType = {
    email: '',
  };

  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const handleFormSubmit = async (data: ResetPasswordSchemaType) => {
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
      <Field.Text
        name="email"
        label="Email address"
        type="email"
        placeholder="example@gmail.com"
        autoFocus
        slotProps={{ 
          inputLabel: { shrink: true },
          input: { autoComplete: 'email' }
        }}
      />

      <Button
        fullWidth
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
        description={description}
        centered={centered}
        showDivider={showDivider}
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
