import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { ICONS, Iconify } from '@asyml8/ui';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import { useTranslation } from 'src/hooks/use-translation';

type CaptchaFieldProps = {
  captchaCode: string;
  captchaInput: string;
  isCaptchaValid: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  onRefresh: () => void;
};

export function CaptchaField({
  captchaCode,
  captchaInput,
  isCaptchaValid,
  register,
  errors,
  onRefresh,
}: CaptchaFieldProps) {
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <TextField
        sx={{ flex: 1 }}
        placeholder={t('access.enterCaptcha')}
        {...register('captcha')}
        error={!!errors.captcha || (captchaInput.length === 7 && !isCaptchaValid)}
        helperText={
          (errors.captcha?.message as string) ||
          (captchaInput.length === 7 && !isCaptchaValid ? t('access.captchaNoMatch') : '')
        }
      />
      <Stack direction="row" spacing={1} alignItems="center">
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
            minWidth: 200,
            textAlign: 'center',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {captchaCode}
        </Box>
        <IconButton onClick={onRefresh} color="primary">
          <Iconify icon={ICONS.RESTART} />
        </IconButton>
      </Stack>
    </Stack>
  );
}
