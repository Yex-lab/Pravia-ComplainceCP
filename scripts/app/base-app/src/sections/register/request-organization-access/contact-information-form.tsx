import { formatPhone, formatBusinessPhone } from '@asyml8/ui';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { useTranslation } from 'src/hooks/use-translation';

type ContactInformationFormProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessPhone: string;
  onChange: (field: string, value: string) => void;
};

export function ContactInformationForm({
  firstName,
  lastName,
  email,
  phone,
  businessPhone,
  onChange,
}: ContactInformationFormProps) {
  const { t } = useTranslation();

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label={t('register.contact.firstName')}
          value={firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          required
          autoFocus
        />
        <TextField
          fullWidth
          label={t('register.contact.lastName')}
          value={lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          required
        />
      </Stack>

      <TextField
        fullWidth
        label={t('register.contact.email')}
        type="email"
        value={email}
        onChange={(e) => onChange('email', e.target.value)}
        required
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label={t('register.contact.phone')}
          placeholder="(555) 555-5555"
          value={phone}
          onChange={(e) => onChange('phone', formatPhone(e.target.value))}
          required
        />
        <TextField
          fullWidth
          label={t('register.contact.businessPhone')}
          placeholder="(555) 555-5555 12345"
          value={businessPhone}
          onChange={(e) => onChange('businessPhone', formatBusinessPhone(e.target.value))}
        />
      </Stack>
    </Stack>
  );
}
