/**
 * Supabase Authentication Provider
 *
 * Provides comprehensive authentication functionality using Supabase Auth including:
 * - Email/password authentication
 * - Multi-factor authentication (TOTP)
 * - OAuth/social login (Google, Microsoft, Facebook, Apple)
 * - Password management
 * - Email verification
 * - Session management with automatic token refresh
 * - Configurable token change handler (e.g., for axios)
 *
 * @module AuthProvider
 *
 * Architecture:
 * - Uses reducer pattern for predictable state management
 * - Listens to Supabase onAuthStateChange for automatic session updates
 * - Configurable via AuthConfig for library portability
 * - Logs all auth events using configurable logger
 * - Supabase client injected via props for app isolation
 *
 * State Flow:
 * 1. INITIAL: App loads, checks for existing session
 * 2. LOGIN: User signs in or MFA verification succeeds
 * 3. REGISTER: User creates account
 * 4. LOGOUT: User signs out or session expires
 *
 * Usage:
 * ```tsx
 * import { createClient } from '@supabase/supabase-js';
 * 
 * const supabase = createClient(url, key);
 * 
 * <SupabaseAuthProvider supabaseClient={supabase} config={config}>
 *   <App />
 * </SupabaseAuthProvider>
 * 
 * const { login, logout, user, authenticated } = useAuthContext();
 * ```
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { AuthConfig } from '../auth.config';
import type { AuthState } from '../types';

import { useMemo, useEffect, useReducer, useCallback } from 'react';

import { AuthContext } from '../auth-context';

// ----------------------------------------------------------------------
// Action Types
// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: { user: any };
  [Types.LOGIN]: { user: any };
  [Types.REGISTER]: { user: any };
  [Types.LOGOUT]: undefined;
};

type ActionsType =
  | { type: Types.INITIAL; payload: Payload[Types.INITIAL] }
  | { type: Types.LOGIN; payload: Payload[Types.LOGIN] }
  | { type: Types.REGISTER; payload: Payload[Types.REGISTER] }
  | { type: Types.LOGOUT };

// ----------------------------------------------------------------------
// State Management
// ----------------------------------------------------------------------

const initialState: AuthState = {
  user: null,
  loading: true,
};

const reducer = (state: AuthState, action: ActionsType): AuthState => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------
// Provider Component
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  supabaseClient: SupabaseClient;
  config: AuthConfig;
};

export function SupabaseAuthProvider({ children, supabaseClient, config }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const logger = useMemo(
    () =>
      config.logger || {
        info: () => {},
        error: () => {},
        debug: () => {},
      },
    [config.logger]
  );

  const handleTokenChange = useCallback(
    async (accessToken: string | null) => {
      if (config.onTokenChange) {
        await config.onTokenChange(accessToken);
      }
    },
    [config]
  );

  const initialize = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();

      if (error) {
        logger.error('Failed to get session:', error);
        dispatch({ type: Types.INITIAL, payload: { user: null } });
        await handleTokenChange(null);
        throw error;
      }

      if (session?.user) {
        const user = {
          ...session.user,
          session: {
            access_token: session.access_token,
            expires_at: session.expires_at,
            expires_in: session.expires_in,
            refresh_token: session.refresh_token,
            token_type: session.token_type,
          },
        };
        dispatch({ type: Types.INITIAL, payload: { user } });
        await handleTokenChange(session.access_token);
      } else {
        dispatch({ type: Types.INITIAL, payload: { user: null } });
        await handleTokenChange(null);
      }
    } catch (error) {
      logger.error('Initialize error:', error);
      dispatch({ type: Types.INITIAL, payload: { user: null } });
      await handleTokenChange(null);
    }
  }, [supabaseClient, logger, handleTokenChange]);

  useEffect(() => {
    initialize();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event: string, session: any) => {
      logger.info('Auth state changed:', event);

      if (session?.user) {
        const user = {
          ...session.user,
          session: {
            access_token: session.access_token,
            expires_at: session.expires_at,
            expires_in: session.expires_in,
            refresh_token: session.refresh_token,
            token_type: session.token_type,
          },
        };
        dispatch({ type: Types.LOGIN, payload: { user } });
        await handleTokenChange(session.access_token);
      } else {
        dispatch({ type: Types.LOGOUT });
        await handleTokenChange(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialize, supabaseClient, logger, handleTokenChange]);

  // ----------------------------------------------------------------------
  // Core Authentication Methods
  // ----------------------------------------------------------------------

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          logger.error('Login failed:', error);
          throw error;
        }

        const user = {
          ...data.user,
          session: {
            access_token: data.session.access_token,
            expires_at: data.session.expires_at,
            expires_in: data.session.expires_in,
            refresh_token: data.session.refresh_token,
            token_type: data.session.token_type,
          },
        };

        dispatch({ type: Types.LOGIN, payload: { user } });
        await handleTokenChange(data.session.access_token);
        logger.info('Login successful');
      } catch (error) {
        logger.error('Login error:', error);
        throw error;
      }
    },
    [supabaseClient, logger, handleTokenChange]
  );

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      try {
        const { error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${config.paths.authCallback}`,
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });

        if (error) {
          logger.error('Registration failed:', error);
          throw error;
        }

        logger.info('Registration successful');
      } catch (error) {
        logger.error('Registration error:', error);
        throw error;
      }
    },
    [supabaseClient, config.paths.authCallback, logger]
  );

  const logout = useCallback(async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        logger.error('Logout failed:', error);
        dispatch({ type: Types.LOGOUT });
        await handleTokenChange(null);
        logger.info('Local session cleared despite server error');
        return;
      }

      dispatch({ type: Types.LOGOUT });
      await handleTokenChange(null);
      logger.info('Logout successful');
    } catch (error) {
      logger.error('Logout error:', error);
      dispatch({ type: Types.LOGOUT });
      await handleTokenChange(null);
    }
  }, [supabaseClient, logger, handleTokenChange]);

  const forgotPassword = useCallback(
    async (email: string) => {
      try {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback`,
        });

        if (error) {
          logger.error('Forgot password failed:', error);
          throw error;
        }

        logger.info('Password reset email sent');
      } catch (error) {
        logger.error('Forgot password error:', error);
        throw error;
      }
    },
    [supabaseClient, logger]
  );

  const updatePassword = useCallback(
    async (password: string) => {
      try {
        const { error } = await supabaseClient.auth.updateUser({ password });

        if (error) {
          logger.error('Update password failed:', error);
          throw error;
        }

        logger.info('Password updated successfully');
      } catch (error) {
        logger.error('Update password error:', error);
        throw error;
      }
    },
    [supabaseClient, logger]
  );

  // ----------------------------------------------------------------------
  // MFA Methods
  // ----------------------------------------------------------------------

  const enrollMFA = useCallback(async () => {
    try {
      const { data, error } = await supabaseClient.auth.mfa.enroll({
        factorType: 'totp',
      });

      if (error) {
        logger.error('MFA enrollment failed:', error);
        throw error;
      }

      logger.info('MFA enrollment initiated');
      return { data, error: null };
    } catch (error) {
      logger.error('MFA enrollment error:', error);
      throw error;
    }
  }, [supabaseClient, logger]);

  const challengeMFA = useCallback(
    async (factorId: string) => {
      try {
        const { data, error } = await supabaseClient.auth.mfa.challenge({ factorId });

        if (error) {
          logger.error('MFA challenge failed:', error);
          throw error;
        }

        logger.info('MFA challenge created');
        return { data, error: null };
      } catch (error) {
        logger.error('MFA challenge error:', error);
        throw error;
      }
    },
    [supabaseClient, logger]
  );

  const verifyMFA = useCallback(
    async (params: { factorId: string; challengeId: string; code: string }) => {
      try {
        const { data, error } = await supabaseClient.auth.mfa.verify(params);

        if (error) {
          logger.error('MFA verification failed:', error);
          throw error;
        }

        logger.info('MFA verification successful');
        return { data, error: null };
      } catch (error) {
        logger.error('MFA verification error:', error);
        throw error;
      }
    },
    [supabaseClient, logger]
  );

  const unenrollMFA = useCallback(
    async (factorId: string) => {
      try {
        const { data, error } = await supabaseClient.auth.mfa.unenroll({ factorId });

        if (error) {
          logger.error('MFA unenrollment failed:', error);
          throw error;
        }

        logger.info('MFA unenrolled successfully');
        return { data, error: null };
      } catch (error) {
        logger.error('MFA unenrollment error:', error);
        throw error;
      }
    },
    [supabaseClient, logger]
  );

  const listMFAFactors = useCallback(async () => {
    try {
      const { data, error } = await supabaseClient.auth.mfa.listFactors();

      if (error) {
        logger.error('Failed to list MFA factors:', error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      logger.error('List MFA factors error:', error);
      throw error;
    }
  }, [supabaseClient, logger]);

  const getAuthenticatorAssuranceLevel = useCallback(async () => {
    try {
      const { data, error } = await supabaseClient.auth.mfa.getAuthenticatorAssuranceLevel();

      if (error) {
        logger.error('Failed to get AAL:', error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      logger.error('Get AAL error:', error);
      throw error;
    }
  }, [supabaseClient, logger]);

  // ----------------------------------------------------------------------
  // OAuth Methods
  // ----------------------------------------------------------------------

  const signInWithProvider = useCallback(
    async (params: {
      provider: 'azure' | 'google' | 'facebook' | 'apple';
      options?: {
        redirectTo?: string;
        scopes?: string;
      };
    }) => {
      try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
          provider: params.provider,
          options: {
            redirectTo:
              params.options?.redirectTo || `${window.location.origin}${config.paths.authCallback}`,
            scopes: params.options?.scopes,
          },
        });

        if (error) {
          logger.error(`OAuth sign-in with ${params.provider} failed:`, error);
          throw error;
        }

        logger.info(`OAuth sign-in with ${params.provider} initiated`);
        return { data, error: null };
      } catch (error) {
        logger.error('OAuth sign-in error:', error);
        throw error;
      }
    },
    [supabaseClient, config.paths.authCallback, logger]
  );

  // ----------------------------------------------------------------------
  // Email Verification Methods
  // ----------------------------------------------------------------------

  const resendVerificationEmail = useCallback(
    async (email: string) => {
      try {
        const { error } = await supabaseClient.auth.resend({
          type: 'signup',
          email,
          options: {
            emailRedirectTo: `${window.location.origin}${config.paths.authCallback}`,
          },
        });

        if (error) {
          logger.error('Failed to resend verification email:', error);
          throw error;
        }

        logger.info('Verification email resent successfully');
      } catch (error) {
        logger.error('Resend verification email error:', error);
        throw error;
      }
    },
    [supabaseClient, config.paths.authCallback, logger]
  );

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            id: state.user?.id,
            accessToken: state.user?.session?.access_token,
            displayName:
              `${state.user?.user_metadata?.first_name || ''} ${state.user?.user_metadata?.last_name || ''}`.trim(),
            role: state.user?.role ?? 'admin',
          }
        : null,
      method: 'supabase',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      register,
      logout,
      forgotPassword,
      updatePassword,
      enrollMFA,
      challengeMFA,
      verifyMFA,
      unenrollMFA,
      listMFAFactors,
      getAuthenticatorAssuranceLevel,
      signInWithProvider,
      resendVerificationEmail,
    }),
    [
      state.user,
      status,
      login,
      register,
      logout,
      forgotPassword,
      updatePassword,
      enrollMFA,
      challengeMFA,
      verifyMFA,
      unenrollMFA,
      listMFAFactors,
      getAuthenticatorAssuranceLevel,
      signInWithProvider,
      resendVerificationEmail,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
