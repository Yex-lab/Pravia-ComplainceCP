export interface AuthData {
  accessToken: string;
  organizationId: string;
}

export function getAuthData(): AuthData | null {
  try {
    // Get JWT token from localStorage - try different possible keys
    let authData = localStorage.getItem('sb-ahanrwalkdrbbhlhjxzr-auth-token');

    // If not found, try to find any supabase auth key
    if (!authData) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('auth-token')) {
          authData = localStorage.getItem(key);
          break;
        }
      }
    }

    if (!authData) {
      return null;
    }

    const parsedAuth = JSON.parse(authData);
    const accessToken = parsedAuth.access_token;

    // Extract organization_id from user metadata
    const userMetadata = parsedAuth.user?.user_metadata;
    const organizationId = userMetadata?.organization_id || '';

    if (!accessToken || !organizationId) {
      return null;
    }

    return {
      accessToken,
      organizationId,
    };
  } catch {
    return null;
  }
}
