'use client';

import type { Theme, ThemeProviderProps as MuiThemeProviderProps } from '@mui/material/styles';
import type {} from './extend-theme-types';
import type { ThemeOptions } from './types';
import type { ThemeSettingsState } from './settings-types';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as ThemeVarsProvider } from '@mui/material/styles';

import { createTheme } from './create-theme';
import { Rtl } from './with-settings/right-to-left';

// ----------------------------------------------------------------------

export type ThemeProviderProps = Partial<MuiThemeProviderProps<Theme>> & {
  themeOverrides?: ThemeOptions;
  settingsState?: ThemeSettingsState;
};

export function ThemeProvider({
  themeOverrides,
  settingsState,
  children,
  ...other
}: ThemeProviderProps) {
  const theme = createTheme({
    settingsState,
    themeOverrides,
  });

  return (
    <ThemeVarsProvider disableTransitionOnChange theme={theme} {...other}>
      <CssBaseline />
      <Rtl direction={settingsState?.direction || 'ltr'}>{children}</Rtl>
    </ThemeVarsProvider>
  );
}
