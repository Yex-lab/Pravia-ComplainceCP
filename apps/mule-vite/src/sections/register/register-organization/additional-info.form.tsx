import { formatPhone } from '@asyml8/ui';
import { useRef, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { useTranslation } from 'src/hooks/use-translation';

type AdditionalOrgInfoFormProps = {
  organizationPhone: string;
  website: string;
  fax: string;
  onChange: (field: string, value: string) => void;
};

export function AdditionalOrgInfoForm({
  organizationPhone,
  website,
  fax,
  onChange,
}: AdditionalOrgInfoFormProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label={t('register.additionalOrgInfo.organizationPhone')}
          value={organizationPhone}
          onChange={(e) => onChange('organizationPhone', formatPhone(e.target.value))}
          placeholder="(555) 555-5555"
          required
          inputRef={inputRef}
        />
        <TextField
          fullWidth
          label={t('register.additionalOrgInfo.fax')}
          value={fax}
          onChange={(e) => onChange('fax', formatPhone(e.target.value))}
          placeholder="(555) 555-5555"
        />
      </Stack>

      <TextField
        fullWidth
        label={t('register.additionalOrgInfo.website')}
        value={website}
        onChange={(e) => onChange('website', e.target.value)}
        placeholder="https://example.com"
      />
    </Stack>
  );
}
