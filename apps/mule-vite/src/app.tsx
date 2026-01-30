import 'src/global.css';
import 'src/lib/i18n';

import { useState, useEffect } from 'react';
import { QueryClient, useQueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  queryStore,
  MotionLazy,
  usePathname,
  themeConfig,
  ProgressBar,
  SettingsDrawer,
  defaultSettings,
  SettingsProvider,
  useSettingsContext,
  SupabaseAuthProvider,
  CustomSnackbarProvider,
  ConfirmationDialogProvider,
  ThemeProvider as UIThemeProvider,
} from '@asyml8/ui';

import { supabase } from 'src/lib/supabase';
import { appAuthConfig } from 'src/contexts/auth/app-auth.config';

import { InactivityMonitor } from 'src/components/inactivity-monitor';

// ----------------------------------------------------------------------

function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const settings = useSettingsContext();

  //Test commit
  return (
    <UIThemeProvider
      settingsState={settings.state}
      modeStorageKey={themeConfig.modeStorageKey}
      defaultMode="light"
    >
      {children}
    </UIThemeProvider>
  );
}

// ----------------------------------------------------------------------

function QueryStoreInitializer() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryStore.setQueryClient(queryClient);
  }, [queryClient]);

  return null;
}

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Expose queryClient to window for testing/debugging
  useEffect(() => {
    if (import.meta.env.DEV) {
      (window as any).__REACT_QUERY_CLIENT__ = queryClient;
    }
  }, [queryClient]);

  const customSettings = {
    ...defaultSettings,
    primaryColor: 'preset3' as const,
  };

  useScrollToTop();

  return (
    <QueryClientProvider client={queryClient}>
      <QueryStoreInitializer />
      <SupabaseAuthProvider supabaseClient={supabase} config={appAuthConfig}>
        <InactivityMonitor />
        <SettingsProvider defaultSettings={customSettings}>
          <AppThemeProvider>
            <MotionLazy>
              <CustomSnackbarProvider>
                <ConfirmationDialogProvider>
                  <ProgressBar />
                  <SettingsDrawer defaultSettings={customSettings} />
                  {children}
                </ConfirmationDialogProvider>
              </CustomSnackbarProvider>
            </MotionLazy>
          </AppThemeProvider>
        </SettingsProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
