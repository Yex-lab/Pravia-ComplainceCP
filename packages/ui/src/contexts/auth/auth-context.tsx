import type { AuthContextValue } from './types';

import { createContext } from 'react';

// ----------------------------------------------------------------------

/**
 * Auth Context
 * 
 * This context defines the authentication interface (contract) that all auth providers
 * must implement. It's provider-agnostic, meaning:
 * 
 * - SupabaseAuthProvider implements this context
 * - Auth0AuthProvider would implement this same context
 * - FirebaseAuthProvider would implement this same context
 * 
 * This allows apps to swap auth providers without changing any consuming code.
 * All providers fulfill the same contract, so useAuthContext() works with any provider.
 * 
 * @example
 * // App can use any provider - consuming code stays the same
 * <SupabaseAuthProvider supabaseClient={supabase} config={config}>
 *   <App />
 * </SupabaseAuthProvider>
 * 
 * // In components
 * const { login, logout, user } = useAuthContext();
 */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
