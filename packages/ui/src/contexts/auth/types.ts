export type UserType = Record<string, any> | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  method?: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  // Core auth methods
  login?: (email: string, password: string) => Promise<void>;
  register?: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout?: () => Promise<void>;
  forgotPassword?: (email: string) => Promise<void>;
  updatePassword?: (password: string) => Promise<void>;
  // MFA methods
  enrollMFA?: () => Promise<{ data: any; error: null }>;
  challengeMFA?: (factorId: string) => Promise<{ data: any; error: null }>;
  verifyMFA?: (params: {
    factorId: string;
    challengeId: string;
    code: string;
  }) => Promise<{ data: any; error: null }>;
  unenrollMFA?: (factorId: string) => Promise<{ data: any; error: null }>;
  listMFAFactors?: () => Promise<{ data: any; error: null }>;
  getAuthenticatorAssuranceLevel?: () => Promise<{ data: any; error: null }>;
  // OAuth methods
  signInWithProvider?: (params: {
    provider: 'azure' | 'google' | 'facebook' | 'apple';
    options?: {
      redirectTo?: string;
      scopes?: string;
    };
  }) => Promise<{ data: any; error: null }>;
  // Email verification methods
  resendVerificationEmail?: (email: string) => Promise<void>;
  // Legacy
  checkUserSession?: () => Promise<void>;
};
