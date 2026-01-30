import { useRef, useEffect } from 'react';
import { ICONS, Iconify, formatPhone, formatBusinessPhone } from '@asyml8/ui';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

type ContactInfoFormProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessPhone: string;
  captcha: string;
  captchaCode: string;
  onChange: (field: string, value: string) => void;
  onRefreshCaptcha: () => void;
  onNext?: () => void;
  errors?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    businessPhone?: string;
    captcha?: string;
  };
  labels: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    businessPhone: string;
    captcha: string;
    captchaPlaceholder: string;
  };
};

export function ContactInfoForm({
  firstName,
  lastName,
  email,
  phone,
  businessPhone,
  captcha,
  captchaCode,
  onChange,
  onRefreshCaptcha,
  onNext,
  errors = {},
  labels,
}: ContactInfoFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Validar todos los campos requeridos
      if (firstName && lastName && email && phone && captcha && captcha === captchaCode && onNext) {
        onNext();
      }
    }
  };

  return (
    <Stack spacing={3} onKeyDown={handleKeyDown}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label={labels.firstName}
          value={firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          error={!!errors.firstName}
          helperText={errors.firstName}
          inputRef={inputRef}
          required
        />
        <TextField
          fullWidth
          label={labels.lastName}
          value={lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          error={!!errors.lastName}
          helperText={errors.lastName}
          required
        />
      </Stack>

      <TextField
        fullWidth
        label={labels.email}
        type="email"
        value={email}
        onChange={(e) => onChange('email', e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        required
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label={labels.phone}
          value={phone}
          onChange={(e) => {
            const formatted = formatPhone(e.target.value);
            onChange('phone', formatted);
          }}
          error={!!errors.phone}
          helperText={errors.phone}
          placeholder="(555) 555-5555"
          required
        />
        <TextField
          fullWidth
          label={labels.businessPhone}
          value={businessPhone}
          onChange={(e) => {
            const formatted = formatBusinessPhone(e.target.value);
            onChange('businessPhone', formatted);
          }}
          error={!!errors.businessPhone}
          helperText={errors.businessPhone}
          placeholder="(555) 555-5555 12345"
        />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label={labels.captcha}
          placeholder={labels.captchaPlaceholder}
          value={captcha}
          onChange={(e) => onChange('captcha', e.target.value.toUpperCase())}
          error={!!errors.captcha}
          helperText={errors.captcha}
          required
        />
        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: '50%' } }}>
          <Box
            sx={{
              bgcolor: 'grey.900',
              color: 'white',
              px: 2,
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              letterSpacing: 4,
              userSelect: 'none',
              flex: 1,
              textAlign: 'center',
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {captchaCode}
          </Box>
          <IconButton onClick={onRefreshCaptcha} color="primary" sx={{ height: 56 }}>
            <Iconify icon={ICONS.RESTART} />
          </IconButton>
        </Box>
      </Stack>
    </Stack>
  );
}
