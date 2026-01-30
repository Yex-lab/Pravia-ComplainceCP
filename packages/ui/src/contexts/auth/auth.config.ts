export interface AuthConfig {
  paths: {
    authCallback: string;
    updatePassword: string;
  };
  logger?: {
    info: (message: string, ...args: any[]) => void;
    error: (message: string, ...args: any[]) => void;
    debug: (message: string, ...args: any[]) => void;
  };
  onTokenChange?: (token: string | null) => Promise<void>;
}
