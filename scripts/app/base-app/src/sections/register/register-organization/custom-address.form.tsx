import { useState, useEffect, useCallback } from 'react';
import { ICONS, Iconify, US_STATES, CA_COUNTIES } from '@asyml8/ui';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useDebounce } from 'src/hooks/use-debounce';
import { useAddressSearch } from 'src/hooks/use-address-search';

import { SearchableAutocomplete } from '../common';

/**
 * Props for CustomAddressForm component
 * This component handles both primary and mailing address forms with autocomplete and validation
 */
type CustomAddressFormProps = {
  /** Type of address form - determines behavior and optional features */
  type: 'primary' | 'mailing';

  /** Address line 1 value (street address) */
  addressLine1: string;
  /** Address line 2 value (apt, suite, etc.) */
  addressLine2: string;
  /** City value */
  city: string;
  /** State code value (e.g., 'CA', 'NY') */
  state: string;
  /** ZIP code value (5 digits) */
  zip: string;
  /** County value */
  county: string;

  /** Callback when any field value changes */
  onChange: (field: string, value: string) => void;

  /** Optional validation error message to display below form */
  validationError?: string;

  /** Whether the entire form is disabled */
  disabled?: boolean;

  /** Localized labels for all form fields */
  labels: {
    /** Optional title displayed above form (e.g., "Primary Address", "Mailing Address") */
    title?: string;
    /** Label for address line 1 field */
    addressLine1: string;
    /** Label for address line 2 field */
    addressLine2: string;
    /** Label for city field */
    city: string;
    /** Label for state field */
    state: string;
    /** Label for ZIP code field */
    zip: string;
    /** Label for county field */
    county: string;
    /** Label for "Same as Primary Address" checkbox (only used when type='mailing') */
    sameAsPrimary?: string;
  };

  /** Whether mailing address should copy primary address (only for type='mailing') */
  sameAsPrimary?: boolean;
  /** Callback when "Same as Primary" checkbox changes (only for type='mailing') */
  onSameAsPrimaryChange?: (checked: boolean) => void;
};

/**
 * CustomAddressForm - Reusable address form component with autocomplete and validation
 *
 * Features:
 * - USPS address autocomplete with debounced search (500ms)
 * - Support for both primary and mailing address types
 * - Optional "Same as Primary Address" toggle for mailing addresses
 * - State and County dropdown selectors with icons
 * - ZIP code formatting (digits only, max 5)
 * - Validation error display
 * - Fully customizable labels for internationalization
 *
 * @example
 * // Primary address
 * <CustomAddressForm
 *   type="primary"
 *   addressLine1={address.line1}
 *   onChange={handleChange}
 *   labels={{
 *     title: "Primary Address",
 *     addressLine1: "Address Line 1",
 *     ...
 *   }}
 * />
 *
 * @example
 * // Mailing address with toggle
 * <CustomAddressForm
 *   type="mailing"
 *   addressLine1={mailing.line1}
 *   onChange={handleChange}
 *   sameAsPrimary={isSame}
 *   onSameAsPrimaryChange={setIsSame}
 *   labels={{
 *     title: "Mailing Address",
 *     sameAsPrimary: "Same as Primary Address",
 *     ...
 *   }}
 * />
 */
export function CustomAddressForm({
  type,
  addressLine1,
  addressLine2,
  city,
  state,
  zip,
  county,
  onChange,
  validationError,
  disabled = false,
  labels,
  sameAsPrimary = false,
  onSameAsPrimaryChange,
}: CustomAddressFormProps) {
  // Local state for autocomplete input value
  const [inputValue, setInputValue] = useState('');

  // Address search hook with USPS API integration
  const { results, loading, search } = useAddressSearch();

  // Sync inputValue with addressLine1 prop when it changes (e.g., when navigating back or toggling same as primary)
  useEffect(() => {
    setInputValue(addressLine1);
  }, [addressLine1]);

  // Debounced search to avoid excessive API calls while user types
  const debouncedSearch = useDebounce((value: string) => {
    search(value);
  }, 500);

  /**
   * Handle address selection from autocomplete dropdown
   * Populates all address fields with selected address data
   */
  const handleAddressSelect = useCallback(
    (address: any) => {
      if (address) {
        onChange('addressLine1', address.streetAddress);
        onChange('city', address.city);
        onChange('state', address.state);
        onChange('zip', address.zipCode);
      }
    },
    [onChange]
  );

  // Determine if form should be disabled (external disabled prop OR sameAsPrimary toggle)
  const isDisabled = disabled || sameAsPrimary;

  return (
    <Stack spacing={3}>
      {/* Optional title */}
      {labels.title && (
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {labels.title}
        </Typography>
      )}

      {/* "Same as Primary Address" toggle - only shown for mailing type */}
      {type === 'mailing' && onSameAsPrimaryChange && (
        <FormControlLabel
          sx={!labels.title ? { mt: -2 } : undefined}
          control={
            <Switch
              checked={sameAsPrimary}
              onChange={(e) => onSameAsPrimaryChange(e.target.checked)}
              inputProps={{ 'aria-label': 'same as primary address' }}
            />
          }
          label={labels.sameAsPrimary || 'Same as primary'}
        />
      )}

      {/* Address Line 1 with autocomplete */}
      <SearchableAutocomplete
        value={null}
        inputValue={inputValue}
        onInputChange={(newValue) => {
          setInputValue(newValue);
          onChange('addressLine1', newValue);
          debouncedSearch(newValue);
        }}
        onChange={(newValue) => {
          if (newValue) {
            handleAddressSelect(newValue);
            setInputValue(newValue.streetAddress);
          }
        }}
        options={results}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.streetAddress)}
        renderOption={(option) => (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
            <Iconify
              icon={ICONS.MAP_POINT}
              width={20}
              sx={{ color: 'primary.main', flexShrink: 0 }}
            />
            <Typography variant="body2">{option.displayText}</Typography>
          </Stack>
        )}
        loading={loading}
        loadingMessage="Searching for matching addresses..."
        searchingMessage="Searching..."
        label={labels.addressLine1}
        required
        icon={ICONS.MAP_POINT}
        freeSolo
        disabled={isDisabled}
        autoFocus
        minChars={2}
        typeToSearchMessage="Type at least 2 characters to search..."
        noResultsMessage="No addresses found"
        closeDelay={2500}
        enableFade
      />

      {/* Address Line 2 */}
      <TextField
        fullWidth
        disabled={isDisabled}
        label={labels.addressLine2}
        value={addressLine2}
        onChange={(e) => onChange('addressLine2', e.target.value)}
      />

      {/* City and State row */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          disabled={isDisabled}
          label={labels.city}
          value={city}
          onChange={(e) => onChange('city', e.target.value)}
          required
        />
        <TextField
          select
          fullWidth
          disabled
          label={labels.state}
          value={state}
          onChange={(e) => onChange('state', e.target.value)}
          required
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 48 * 4,
                },
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <Iconify icon={ICONS.FLAG} sx={{ ml: 1, mr: 1, color: 'text.disabled' }} />
            ),
          }}
        >
          {US_STATES.map((s) => (
            <MenuItem key={s.code} value={s.code}>
              {s.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* ZIP and County row */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          disabled={isDisabled}
          label={labels.zip}
          value={zip}
          onChange={(e) => {
            // Format ZIP: digits only, max 5 characters
            const cleaned = e.target.value.replace(/\D/g, '').slice(0, 5);
            onChange('zip', cleaned);
          }}
          required
        />
        <TextField
          select
          fullWidth
          disabled={isDisabled}
          label={labels.county}
          value={county}
          onChange={(e) => onChange('county', e.target.value)}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 48 * 4,
                },
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <Iconify icon={ICONS.CITY} sx={{ ml: 1, mr: 1, color: 'text.disabled' }} />
            ),
          }}
        >
          {CA_COUNTIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* Validation error display */}
      {validationError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {validationError}
        </Alert>
      )}
    </Stack>
  );
}
