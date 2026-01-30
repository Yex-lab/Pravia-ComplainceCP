import type { SettingsState } from './types';

import { defaultSettings, SETTINGS_STORAGE_KEY } from './settings-config';

// ----------------------------------------------------------------------

export async function detectSettings(
  storageKey: string = SETTINGS_STORAGE_KEY
): Promise<SettingsState> {
  // Static builds or Vite (client-only)
  if (typeof window !== 'undefined' || process.env.BUILD_STATIC_EXPORT === 'true') {
    return defaultSettings;
  }
  
  // Next.js server-side
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const settingsStore = cookieStore.get(storageKey);
    return settingsStore ? JSON.parse(settingsStore.value) : defaultSettings;
  } catch {
    // Fallback for any other environment
    return defaultSettings;
  }
}
