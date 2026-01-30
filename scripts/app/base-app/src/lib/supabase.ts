import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'http://localhost:3000';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'your-anon-key';
const supabaseStorage = import.meta.env.VITE_SUPABASE_STORAGE ?? 'session';

const DEFAULT_STORAGE = 'session';

/**
 * Supabase Client Instance
 *
 * This client is created at the app level (not in the shared UI package) to ensure:
 * 1. Each app has its own isolated Supabase instance
 * 2. Each app can connect to different Supabase projects
 * 3. No singleton conflicts between apps in the monorepo
 *
 * The client is injected into SupabaseAuthProvider via props:
 * <SupabaseAuthProvider supabaseClient={supabase} config={config}>
 *
 * This dependency injection pattern keeps the auth provider reusable
 * across all apps while maintaining proper isolation.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorage === DEFAULT_STORAGE ? sessionStorage : localStorage,
  },
});
