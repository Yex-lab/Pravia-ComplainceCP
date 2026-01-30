import type { Theme, SxProps } from '@mui/material/styles';
import type { ThemeConfig, ThemeColorPreset } from '@asyml8/ui';

// ----------------------------------------------------------------------

export type SettingsState = {
  version: string;
  fontSize: number;
  fontFamily: string;
  compactLayout: boolean;
  mode: 'light' | 'dark' | 'system';
  contrast: 'default' | 'bold' | 'high';
  navColor: 'integrate' | 'apparent';
  direction: ThemeConfig['direction'];
  navLayout: 'vertical' | 'horizontal' | 'mini';
  primaryColor: string;
};

export type SettingsContextValue = {
  state: SettingsState;
  canReset: boolean;
  onReset: () => void;
  setState: (updateValue: Partial<SettingsState>) => void;
  setField: (name: keyof SettingsState, updateValue: SettingsState[keyof SettingsState]) => void;
  // drawer
  openDrawer: boolean;
  onCloseDrawer: () => void;
  onToggleDrawer: () => void;
};

export type SettingsProviderProps = {
  children: React.ReactNode;
  cookieSettings?: SettingsState;
  defaultSettings: SettingsState;
  storageKey?: string;
};

export type SettingsDrawerProps = {
  sx?: SxProps<Theme>;
  defaultSettings: SettingsState;
};
