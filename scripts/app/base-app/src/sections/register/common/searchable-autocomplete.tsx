import type { ReactNode } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';
import type { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { renderStartIcon } from './form-components';

type LoadingAnimationType = 'circular' | 'linear' | 'dots' | 'none';

type LoadingOverlayProps = {
  message: string;
  animation?: LoadingAnimationType;
  size?: number;
  sx?: SxProps<Theme>;
};

const LoadingOverlay = ({
  message,
  animation = 'circular',
  size = 20,
  sx,
}: LoadingOverlayProps) => {
  const renderAnimation = () => {
    switch (animation) {
      case 'circular':
        return <CircularProgress size={size} color="primary" />;
      case 'linear':
        return <LinearProgress sx={{ width: 100 }} />;
      case 'dots':
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  animation: 'pulse 1.4s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                  '@keyframes pulse': {
                    '0%, 80%, 100%': { opacity: 0.3 },
                    '40%': { opacity: 1 },
                  },
                }}
              />
            ))}
          </Box>
        );
      case 'none':
        return null;
      default:
        return <CircularProgress size={size} color="primary" />;
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.25, px: 1, ...sx }}>
      {renderAnimation()}
      <Typography variant="body2" sx={{ color: 'text.primary', fontStyle: 'italic' }}>
        {message}
      </Typography>
    </Box>
  );
};

type SearchableAutocompleteProps<T> = {
  // Value props
  value: T | null;
  inputValue: string;
  onInputChange: (value: string) => void;
  onChange: (value: T | null) => void;

  // Options
  options: T[];
  getOptionLabel: (option: T | string) => string;
  renderOption?: (option: T) => ReactNode;

  // Loading states
  loading?: boolean;
  isTyping?: boolean;
  loadingMessage?: string;
  searchingMessage?: string;
  loadingAnimation?: LoadingAnimationType;
  loadingSize?: number;
  loadingSx?: SxProps<Theme>;

  // Labels
  label: string;
  helperText?: string;
  required?: boolean;

  // Messages
  minChars?: number;
  typeToSearchMessage?: string;
  noResultsMessage?: string;

  // Icon
  icon?: string;
  activeIcon?: string;
  isActive?: boolean;

  // Behavior
  freeSolo?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  autoFocus?: boolean;

  // Custom footer
  showFooter?: boolean;
  footerContent?: ReactNode;
  footerWarning?: string;
  closeButtonLabel?: string;
  onClose?: () => void;

  // Controlled open state
  open?: boolean;
  onOpen?: () => void;
  onCloseDropdown?: (event: any, reason: any) => void;
  closeDelay?: number; // Delay in ms before closing dropdown after input stops
  enableFade?: boolean; // Enable fade animation on close

  // Validation
  regex?: RegExp;
};

export function SearchableAutocomplete<T>({
  value,
  inputValue,
  onInputChange,
  onChange,
  options,
  getOptionLabel,
  renderOption,
  loading = false,
  isTyping = false,
  loadingMessage = 'Searching...',
  searchingMessage = 'Searching...',
  loadingAnimation = 'circular',
  loadingSize = 20,
  loadingSx,
  label,
  helperText,
  required = false,
  minChars = 2,
  typeToSearchMessage = 'Type at least 2 characters to search...',
  noResultsMessage = 'No results found',
  icon,
  activeIcon,
  isActive = false,
  freeSolo = false,
  disabled = false,
  fullWidth = true,
  autoFocus = false,
  showFooter = false,
  footerContent,
  footerWarning,
  closeButtonLabel = 'Close',
  onClose,
  open,
  onOpen,
  onCloseDropdown,
  closeDelay = 0,
  enableFade = false,
  regex,
}: SearchableAutocompleteProps<T>) {
  const [isClosing, setIsClosing] = useState(false);
  const [internalOpen, setInternalOpen] = useState(open);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync internal open state with prop
  useEffect(() => {
    setInternalOpen(open);
  }, [open]);

  const handleInputChange = (_: any, newValue: string) => {
    // Clear any pending close timer when user types
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsClosing(false);

    if (!regex || newValue === '' || regex.test(newValue)) {
      onInputChange(newValue);
    }
  };

  const handleChange = (_: any, newValue: T | string | null) => {
    if (typeof newValue === 'object' && newValue) {
      onChange(newValue);
    } else if (freeSolo && typeof newValue === 'string') {
      onInputChange(newValue);
    } else {
      onChange(null);
    }
  };

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      label={label}
      required={required}
      helperText={helperText}
      disabled={disabled}
      autoFocus={autoFocus}
      InputProps={{
        ...params.InputProps,
        startAdornment: icon ? (
          <>
            {renderStartIcon(activeIcon && isActive ? activeIcon : icon, isActive)}
            {params.InputProps.startAdornment}
          </>
        ) : (
          params.InputProps.startAdornment
        ),
        endAdornment: <>{params.InputProps.endAdornment}</>,
      }}
    />
  );

  const defaultRenderOption = (props: any, option: T) => {
    const { key, ...otherProps } = props;
    return (
      <Box component="li" key={key} {...otherProps}>
        {renderOption ? (
          renderOption(option)
        ) : (
          <Typography variant="body2">{getOptionLabel(option)}</Typography>
        )}
      </Box>
    );
  };

  const listboxComponent = showFooter
    ? (props: any) => (
        <Box component="ul" {...props}>
          {props.children}
          {footerWarning && (
            <Box
              component="li"
              sx={{ p: 2, borderTop: 1, borderColor: 'divider', listStyle: 'none' }}
            >
              <Typography variant="body2" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
                {footerWarning}
              </Typography>
            </Box>
          )}
          {footerContent}
          <Box
            component="li"
            sx={{
              p: 1,
              borderTop: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'flex-end',
              listStyle: 'none',
            }}
          >
            <Button size="small" onClick={onClose}>
              {closeButtonLabel}
            </Button>
          </Box>
        </Box>
      )
    : undefined;

  // Handle delayed close with fade
  useEffect(() => {
    if (!loading && !isTyping && closeDelay > 0 && internalOpen) {
      // Start fade animation if enabled
      if (enableFade) {
        setIsClosing(true);
      }

      // Set timer to close dropdown
      closeTimerRef.current = setTimeout(() => {
        if (onCloseDropdown) {
          onCloseDropdown(null, 'blur');
        }
        setIsClosing(false);
      }, closeDelay);
    }

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, [loading, isTyping, closeDelay, enableFade, internalOpen, onCloseDropdown]);

  return (
    <Autocomplete
      fullWidth={fullWidth}
      freeSolo={freeSolo}
      autoHighlight
      disabled={disabled}
      open={open}
      onOpen={onOpen}
      onClose={onCloseDropdown}
      options={options}
      filterOptions={(x) => x}
      value={value}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange}
      getOptionLabel={getOptionLabel}
      loading={loading || isTyping}
      loadingText={
        <LoadingOverlay
          message={loadingMessage}
          animation={loadingAnimation}
          size={loadingSize}
          sx={loadingSx}
        />
      }
      noOptionsText={
        inputValue.length < minChars ? (
          typeToSearchMessage
        ) : loading || isTyping ? (
          <LoadingOverlay
            message={searchingMessage}
            animation={loadingAnimation}
            size={16}
            sx={loadingSx}
          />
        ) : (
          noResultsMessage
        )
      }
      slotProps={{
        paper: {
          sx:
            enableFade && isClosing
              ? {
                  opacity: 0,
                  transition: 'opacity 300ms ease-out',
                }
              : undefined,
        },
      }}
      renderInput={renderInput}
      renderOption={defaultRenderOption}
      ListboxComponent={listboxComponent}
    />
  );
}
