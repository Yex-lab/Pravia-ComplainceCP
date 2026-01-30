import type { Direction } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Settings state type definition
 * This allows the theme to be configured with runtime settings
 * Apps can provide their own ThemeSettingsState implementation
 */
export type ThemeSettingsState = {
  colorPreset?: string;
  contrast?: 'default' | 'bold' | 'high';
  direction?: Direction;
  navColor?: 'integrate' | 'apparent';
  navLayout?: 'vertical' | 'horizontal' | 'mini';
  primaryColor?: string;
  fontFamily?: string;
  fontSize?: number;
};
