/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ValidateTokenDto {
  /**
   * Supabase access token to validate and convert to internal JWT
   * @minLength 10
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
   */
  token: string;
}

export interface RefreshTokenDto {
  /**
   * Supabase refresh token to generate new access token
   * @minLength 10
   * @example "refresh_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ"
   */
  refreshToken: string;
}

export interface UserProfileDto {
  /**
   * Unique identifier for the user profile
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
  /**
   * Reference to Supabase auth.users.id
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  userId: string;
  /**
   * User display name
   * @example "John Doe"
   */
  displayName?: string;
  /**
   * User first name
   * @example "John"
   */
  firstName?: string;
  /**
   * User last name
   * @example "Doe"
   */
  lastName?: string;
  /**
   * User avatar image URL
   * @example "https://example.com/avatars/user123.jpg"
   */
  avatarUrl?: string;
  /**
   * User timezone
   * @example "America/New_York"
   */
  timezone?: string;
  /**
   * User locale
   * @example "en-US"
   */
  locale?: string;
  /**
   * User preferences and settings
   * @example {"theme":"dark","notifications":{"email":true,"push":false}}
   */
  preferences?: object;
  /**
   * Organization ID
   * @example "123e4567-e89b-12d3-a456-426614174002"
   */
  organizationId?: string;
  /**
   * Profile creation timestamp
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * Profile last update timestamp
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
}

export interface CreateUserProfileDto {
  /**
   * User display name shown in the application interface
   * @maxLength 100
   * @example "John Doe"
   */
  displayName?: string;
  /**
   * User first name
   * @maxLength 50
   * @example "John"
   */
  firstName?: string;
  /**
   * User last name
   * @maxLength 50
   * @example "Doe"
   */
  lastName?: string;
  /**
   * User avatar image URL
   * @format uri
   * @example "https://example.com/avatars/user123.jpg"
   */
  avatarUrl?: string;
  /**
   * User timezone for date/time display
   * @example "America/New_York"
   */
  timezone?: string;
  /**
   * User locale for internationalization
   * @example "en-US"
   */
  locale?: string;
  /**
   * User preferences and application settings
   * @example {"theme":"dark","notifications":{"email":true,"push":false},"dashboard":{"layout":"grid","widgets":["weather","calendar"]}}
   */
  preferences?: object;
}

export interface UpdateUserProfileDto {
  /**
   * User display name shown in the application interface
   * @maxLength 100
   * @example "John Doe"
   */
  displayName?: string;
  /**
   * User first name
   * @maxLength 50
   * @example "John"
   */
  firstName?: string;
  /**
   * User last name
   * @maxLength 50
   * @example "Doe"
   */
  lastName?: string;
  /**
   * User avatar image URL
   * @format uri
   * @example "https://example.com/avatars/user123.jpg"
   */
  avatarUrl?: string;
  /**
   * User timezone for date/time display
   * @example "America/New_York"
   */
  timezone?: string;
  /**
   * User locale for internationalization
   * @example "en-US"
   */
  locale?: string;
  /**
   * User preferences and application settings
   * @example {"theme":"dark","notifications":{"email":true,"push":false},"dashboard":{"layout":"grid","widgets":["weather","calendar"]}}
   */
  preferences?: object;
}

export interface UpdateOrganizationDto {
  /**
   * Organization UUID to assign to the user
   * @format uuid
   * @example "b2c3d4e5-f6a7-8901-bcde-f12345678901"
   */
  organizationId: string;
}

export interface RefreshViewResponseDto {
  /**
   * Operation success status
   * @example true
   */
  success: boolean;
  /**
   * Response message
   * @example "Materialized view refreshed successfully"
   */
  message: string;
}

export interface CreateUserDto {
  /**
   * User email address
   * @format email
   * @example "john.doe@example.com"
   */
  email: string;
  /**
   * User password (optional - if not provided, user will need to set via magic link)
   * @minLength 8
   * @example "SecurePassword123!"
   */
  password?: string;
  /**
   * User metadata for profile creation
   * @example {"first_name":"John","last_name":"Doe","role":"user"}
   */
  user_metadata?: object;
  /**
   * Whether to automatically confirm email (true) or require email verification (false)
   * @default true
   * @example true
   */
  email_confirm?: boolean;
}

export interface SupabaseUserDto {
  /**
   * User ID
   * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  id: string;
  /**
   * User email
   * @example "john.doe@example.com"
   */
  email?: string;
  /**
   * User creation timestamp
   * @example "2024-01-15T10:30:00Z"
   */
  created_at: string;
  /** Email confirmation timestamp */
  email_confirmed_at?: string;
  /** Last sign in timestamp */
  last_sign_in_at?: string;
}

export interface CreateUserResponseDto {
  /** Supabase user object */
  user: SupabaseUserDto;
  /** User profile (if metadata was provided) */
  profile?: UserProfileDto;
}

export interface UpdateUserDto {
  /**
   * Updated email address
   * @format email
   * @example "newemail@example.com"
   */
  email?: string;
  /**
   * Updated user metadata
   * @example {"first_name":"Jane","last_name":"Smith","role":"admin"}
   */
  user_metadata?: object;
}

export interface BanUserDto {
  /**
   * Ban duration (e.g., "24h", "7d", "permanent")
   * @default "24h"
   * @example "24h"
   */
  duration?: string;
}

export interface InviteUserDto {
  /**
   * Email address to send invitation to
   * @format email
   * @example "newuser@example.com"
   */
  email: string;
  /**
   * Additional data to include in invitation
   * @example {"role":"user","department":"Engineering"}
   */
  data?: object;
  /**
   * URL to redirect user after accepting invitation
   * @example "https://app.example.com/welcome"
   */
  redirectTo?: string;
}

export interface RoleDto {
  /**
   * Unique identifier for the role
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
  /**
   * Role name
   * @example "Admin"
   */
  name: string;
  /**
   * Role description
   * @example "Administrator with full access"
   */
  description?: string;
  /**
   * Parent role ID for hierarchical roles
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  parentRoleId?: string;
  /**
   * Role hierarchy level
   * @example 0
   */
  level: number;
  /**
   * Whether this is a system-defined role
   * @example false
   */
  isSystem: boolean;
  /**
   * Whether this role is available across all organizations
   * @example false
   */
  isUniversal: boolean;
  /**
   * Organization ID this role belongs to
   * @example "123e4567-e89b-12d3-a456-426614174002"
   */
  organizationId?: string;
  /**
   * Additional role metadata
   * @example {"permissions":["read","write"]}
   */
  metadata?: object;
  /**
   * Role creation timestamp
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * Role last update timestamp
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
}

export interface CreateRoleDto {
  /**
   * Role name
   * @example "Admin"
   */
  name: string;
  /**
   * Role description
   * @example "Administrator with full access"
   */
  description?: string;
  /**
   * Parent role ID for hierarchical roles
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  parentRoleId?: string;
  /**
   * Role hierarchy level
   * @default 0
   * @example 0
   */
  level?: number;
  /**
   * Whether this is a system-defined role
   * @default false
   * @example false
   */
  isSystem?: boolean;
  /**
   * Whether this role is available across all organizations
   * @default false
   * @example false
   */
  isUniversal?: boolean;
  /**
   * Organization ID this role belongs to
   * @example "123e4567-e89b-12d3-a456-426614174002"
   */
  organizationId?: string;
  /**
   * Additional role metadata
   * @example {"permissions":["read","write"]}
   */
  metadata?: object;
}

export interface UpdateRoleDto {
  /**
   * Role name
   * @example "Admin"
   */
  name?: string;
  /**
   * Role description
   * @example "Administrator with full access"
   */
  description?: string;
  /**
   * Parent role ID for hierarchical roles
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  parentRoleId?: string;
  /**
   * Role hierarchy level
   * @default 0
   * @example 0
   */
  level?: number;
  /**
   * Whether this is a system-defined role
   * @default false
   * @example false
   */
  isSystem?: boolean;
  /**
   * Whether this role is available across all organizations
   * @default false
   * @example false
   */
  isUniversal?: boolean;
  /**
   * Organization ID this role belongs to
   * @example "123e4567-e89b-12d3-a456-426614174002"
   */
  organizationId?: string;
  /**
   * Additional role metadata
   * @example {"permissions":["read","write"]}
   */
  metadata?: object;
}
