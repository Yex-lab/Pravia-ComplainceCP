'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { FormHead } from './form-head';

// ----------------------------------------------------------------------

export interface CheckEmailFormProps {
  title?: string;
  description?: React.ReactNode;
  logo?: React.ReactNode;
  centered?: boolean;
  onBackToSignIn?: () => void;
  backButtonText?: string;
  helpText?: string;
}

export function CheckEmailForm({
  title = "Check your email",
  description = "We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.",
  logo,
  centered = true,
  onBackToSignIn,
  backButtonText = "Back to Sign In",
  helpText = "Didn't receive the email? Check your spam folder or try signing up again.",
}: CheckEmailFormProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <FormHead
        logo={logo}
        title={title}
        description={description}
        centered={centered}
      />

      <Box sx={{ textAlign: 'center', width: '100%' }}>
        {onBackToSignIn && (
          <Button
            fullWidth
            color="inherit"
            size="large"
            variant="contained"
            onClick={onBackToSignIn}
            sx={{ textTransform: 'uppercase' }}
          >
            {backButtonText}
          </Button>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          {helpText}
        </Typography>
      </Box>
    </Box>
  );
}
