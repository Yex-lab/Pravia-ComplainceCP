import { ICONS, Iconify } from '@asyml8/ui';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { useTranslation } from 'src/hooks/use-translation';

type StateEntity = {
  id: string;
  name: string;
  acronym?: string;
  orgCode?: string;
  govCode?: string;
};

type OrganizationInfoFormProps = {
  organizationName: string;
  acronym: string;
  orgCode: string;
  govCode: string;
  parentOrganization: string;
  isExisting: boolean;
  allOrganizations: StateEntity[];
  currentOrgId?: string;
  onChange: (field: string, value: string) => void;
  onNext?: () => void;
};

export function OrganizationInfoForm({
  organizationName,
  acronym,
  orgCode,
  govCode,
  parentOrganization,
  isExisting,
  allOrganizations,
  currentOrgId,
  onChange,
  onNext,
}: OrganizationInfoFormProps) {
  const { t } = useTranslation();

  const filteredOrgs = allOrganizations.filter((org) => org.id !== currentOrgId);
  const selectedParent = filteredOrgs.find((org) => org.id === parentOrganization);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Validar campos requeridos
      if (organizationName && onNext) {
        onNext();
      }
    }
  };

  return (
    <Stack spacing={3}>
      <TextField
        fullWidth
        label={t('register.coreOrgInfo.entityName')}
        value={organizationName}
        onChange={(e) => onChange('organizationName', e.target.value)}
        InputProps={{ readOnly: isExisting }}
        onKeyDown={handleKeyDown}
        required
      />

      {isExisting ? (
        <Stack direction="row" spacing={2}>
          <TextField
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Iconify icon={ICONS.DOCUMENT_TEXT} width={16} sx={{ color: 'primary.main' }} />
                {t('register.coreOrgInfo.acronym')}
              </Box>
            }
            value={acronym}
            InputProps={{ readOnly: true }}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
          <TextField
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Iconify icon={ICONS.DOCUMENT_TEXT} width={16} sx={{ color: 'primary.main' }} />
                {t('register.coreOrgInfo.organizationCode')}
              </Box>
            }
            value={orgCode}
            InputProps={{ readOnly: true }}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
          <TextField
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Iconify icon={ICONS.FLAG} width={16} sx={{ color: 'primary.main' }} />
                {t('register.coreOrgInfo.governmentCode')}
              </Box>
            }
            value={govCode}
            InputProps={{ readOnly: true }}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
        </Stack>
      ) : (
        <Stack direction="row" spacing={2}>
          <TextField
            sx={{ flex: 1 }}
            label={t('register.coreOrgInfo.acronym')}
            value={acronym}
            InputProps={{ readOnly: true }}
            required
          />
          <TextField
            sx={{ flex: 1 }}
            label={t('register.coreOrgInfo.organizationCode')}
            value={orgCode}
            InputProps={{ readOnly: true }}
            required
          />
          <TextField
            sx={{ flex: 1 }}
            label={t('register.coreOrgInfo.governmentCode')}
            value={govCode}
            InputProps={{ readOnly: true }}
            required
          />
        </Stack>
      )}

      {!isExisting && (
        <Autocomplete
          fullWidth
          options={filteredOrgs}
          value={selectedParent || null}
          onChange={(_, newValue) => onChange('parentOrganization', newValue?.id || '')}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label={t('register.coreOrgInfo.parentOrganization')} />
          )}
        />
      )}
    </Stack>
  );
}
