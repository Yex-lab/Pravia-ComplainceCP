import { Iconify } from '@asyml8/ui';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useTranslation } from 'src/hooks/use-translation';

export enum OrganizationType {
  STATE = 448150000,
  COUNTY = 448150001,
  LOCAL = 448150002,
  TRIBAL = 448150003,
}

type OrganizationTypeFormProps = {
  value: OrganizationType | null;
  error?: string;
  onChange: (value: OrganizationType) => void;
};

export function OrganizationTypeForm({ value, error, onChange }: OrganizationTypeFormProps) {
  const { t } = useTranslation();

  const orgTypes = [
    // TODO: Re-enable California State Agency option when ready
    // {
    //   value: OrganizationType.STATE,
    //   label: t('register.orgType.state'),
    //   description: t('register.orgType.stateDesc'),
    //   icon: 'solar:buildings-3-bold',
    // },
    {
      value: OrganizationType.COUNTY,
      label: t('register.orgType.county'),
      description: t('register.orgType.countyDesc'),
      icon: 'solar:city-bold',
    },
    {
      value: OrganizationType.LOCAL,
      label: t('register.orgType.local'),
      description: t('register.orgType.localDesc'),
      icon: 'solar:home-angle-bold',
    },
    {
      value: OrganizationType.TRIBAL,
      label: t('register.orgType.tribal'),
      description: t('register.orgType.tribalDesc'),
      icon: 'solar:flag-bold',
    },
  ];

  return (
    <Stack spacing={3}>
      <FormControl error={!!error} fullWidth>
        <RadioGroup
          value={value?.toString() || ''}
          onChange={(e) => onChange(Number(e.target.value) as OrganizationType)}
        >
          <Stack spacing={1.25}>
            {orgTypes.map((type) => (
              <Box
                key={type.value}
                sx={{
                  p: 1.75,
                  border: 1,
                  borderRadius: 1.5,
                  borderColor: value === type.value ? 'primary.main' : 'divider',
                  bgcolor: value === type.value ? 'action.selected' : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <FormControlLabel
                  value={type.value.toString()}
                  control={<Radio />}
                  label={
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                      sx={{ flex: 1, ml: 0.5 }}
                    >
                      <Iconify
                        icon={type.icon as any}
                        width={24}
                        sx={{ mt: 0.5, color: 'primary.main' }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2">{type.label}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                          {type.description}
                        </Typography>
                      </Box>
                    </Stack>
                  }
                  sx={{ m: 0, width: 1 }}
                />
              </Box>
            ))}
          </Stack>
        </RadioGroup>

        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </Stack>
  );
}
