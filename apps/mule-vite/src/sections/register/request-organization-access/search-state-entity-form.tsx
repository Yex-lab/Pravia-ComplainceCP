import type { FluxTypes } from '@asyml8/api-types';

import { useState } from 'react';
import { ICONS, Iconify } from '@asyml8/ui';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { useTranslation } from 'src/hooks/use-translation';

type SearchStateEntityFormProps = {
  selectedEntity: FluxTypes.AccountDto | null;
  notListed: boolean;
  onEntitySelect: (entity: FluxTypes.AccountDto | null) => void;
  onNotListedChange: (checked: boolean) => void;
  onSearch: (searchTerm: string) => void;
  searchResults: FluxTypes.AccountDto[];
  isSearching: boolean;
  error?: string;
  onNext?: () => void;
};

export function SearchStateEntityForm({
  selectedEntity,
  notListed,
  onEntitySelect,
  onNotListedChange,
  onSearch,
  searchResults,
  isSearching,
  error,
  onNext,
}: SearchStateEntityFormProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');

  const handleNotListedChange = (checked: boolean) => {
    onNotListedChange(checked);
    if (checked) {
      onEntitySelect(null);
      setInputValue('');
    }
  };

  return (
    <Stack spacing={3}>
      <Autocomplete
        fullWidth
        autoHighlight
        autoSelect
        options={searchResults}
        value={selectedEntity}
        inputValue={inputValue}
        onInputChange={(_, newValue) => {
          setInputValue(newValue);
          onSearch(newValue);
        }}
        onChange={(_, newValue) => {
          console.log('Autocomplete onChange called with:', newValue);
          onEntitySelect(newValue);
          if (newValue) {
            onNotListedChange(false);
          }
        }}
        getOptionLabel={(option) => option.name}
        disabled={notListed}
        ListboxProps={{
          style: { maxHeight: '300px' },
        }}
        noOptionsText={
          inputValue.length < 2
            ? t('register.searchEntity.placeholder')
            : t('register.searchEntity.noResults')
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={t('register.searchEntity.placeholder')}
            error={!!error}
            helperText={error}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                // Validar campos requeridos
                if ((selectedEntity || notListed) && onNext) {
                  onNext();
                }
              }
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <Iconify
                    icon={selectedEntity ? 'solar:buildings-bold' : 'eva:search-fill'}
                    sx={{ ml: 1, mr: 1, color: selectedEntity ? 'primary.main' : 'text.disabled' }}
                  />
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
              <Iconify
                icon={ICONS.BUILDINGS}
                width={20}
                sx={{ color: 'primary.main', flexShrink: 0 }}
              />
              <Typography variant="body2">{option.name}</Typography>
            </Stack>
          </Box>
        )}
      />
    </Stack>
  );
}
