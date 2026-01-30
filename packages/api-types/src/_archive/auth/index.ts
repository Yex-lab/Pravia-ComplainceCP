import { BaseEntity } from '../shared';

// ========== ENTITIES ==========
export interface UserProfile extends BaseEntity {
  userId: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  timezone?: string;
  locale?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'auto';
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    dashboard?: {
      layout?: 'grid' | 'list';
      widgets?: string[];
    };
    [key: string]: any;
  };
}

export interface AuditLogEntry extends BaseEntity {
  instanceId: string;
  eventType: string;
  ipAddress?: string;
  payload: Record<string, any>;
}

// ========== DTOs ==========
export interface ValidateTokenDto {
  token: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface CreateUserDto {
  email: string;
  password?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    role?: string;
    [key: string]: any;
  };
  email_confirm?: boolean;
}

export interface CreateUserProfileDto {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  timezone?: string;
  locale?: string;
  preferences?: UserProfile['preferences'];
}

export interface UpdateUserProfileDto extends Partial<CreateUserProfileDto> {}

// ========== RESPONSES ==========
export interface AuthValidateResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    user_metadata?: Record<string, any>;
  };
  profile?: UserProfile;
}

export interface CreateUserResponse {
  user: {
    id: string;
    email: string;
    created_at: string;
    user_metadata?: Record<string, any>;
  };
  profile?: UserProfile;
}

export interface TestTokenResponse {
  message: string;
  testUser: {
    email: string;
    id: string;
  };
  swaggerInstructions: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
  internalJWT: string;
  note: string;
}
