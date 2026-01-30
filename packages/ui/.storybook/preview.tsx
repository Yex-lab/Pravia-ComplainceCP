import type { Preview } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LazyMotion, domAnimation } from 'framer-motion';
import { ThemeProvider } from '../src/theme/theme-provider';
import type { SettingsState } from '../src/theme/settings-types';

// Create a default QueryClient with reasonable defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Disable automatic refetching in Storybook
      refetchOnWindowFocus: false,
      // Cache data for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Retry failed queries once
      retry: 1,
    },
  },
});

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#FFFFFF' },
        { name: 'dark', value: '#141A21' }
      ]
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [],
      },
    },
  },
  globalTypes: {
    mode: {
      description: 'Color mode',
      defaultValue: 'light',
      toolbar: {
        title: 'Mode',
        icon: 'sun',
        items: [
          { value: 'light', title: 'Light', left: '☀️' },
          { value: 'dark', title: 'Dark', left: '🌙' },
        ],
      },
    },
    primaryColorPreset: {
      description: 'Primary color preset',
      defaultValue: 'default',
      toolbar: {
        title: 'Primary Color',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default', left: '🔵' },
          { value: 'preset1', title: 'Preset 1', left: '🔷' },
          { value: 'preset2', title: 'Preset 2', left: '🟣' },
          { value: 'preset3', title: 'Preset 3', left: '🔷' },
          { value: 'preset4', title: 'Preset 4', left: '🟡' },
          { value: 'preset5', title: 'Preset 5', left: '🔴' },
        ],
      },
    },
    secondaryColorPreset: {
      description: 'Secondary color preset',
      defaultValue: 'default',
      toolbar: {
        title: 'Secondary Color',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default', left: '🟣' },
          { value: 'preset1', title: 'Preset 1', left: '🟢' },
          { value: 'preset2', title: 'Preset 2', left: '🔵' },
          { value: 'preset3', title: 'Preset 3', left: '🟠' },
          { value: 'preset4', title: 'Preset 4', left: '🍊' },
          { value: 'preset5', title: 'Preset 5', left: '🤎' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      console.log('Context globals:', context.globals);

      // Build settings state from Storybook globals
      const settingsState: SettingsState = {
        // Note: ThemeProvider will use defaultMode from MUI to set light/dark
      };

      const colorMode = context.globals.mode === 'dark' ? 'dark' : 'light';
      const isFullscreen = context.parameters.layout === 'fullscreen';

      console.log('Theme mode:', colorMode);

      return (
        <QueryClientProvider client={queryClient}>
          <ThemeProvider key={colorMode} settingsState={settingsState} defaultMode={colorMode}>
            <LazyMotion features={domAnimation}>
              <div style={{
                minHeight: '100vh',
                padding: isFullscreen ? '0' : '20px',
                display: isFullscreen ? 'block' : 'flex',
                justifyContent: isFullscreen ? 'initial' : 'center',
                alignItems: isFullscreen ? 'initial' : 'center',
              }}>
                <Story />
              </div>
            </LazyMotion>
          </ThemeProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;