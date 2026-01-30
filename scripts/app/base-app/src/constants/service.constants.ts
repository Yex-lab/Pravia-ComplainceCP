/**
 * Centralized query keys for React Query
 * Prevents typos and makes refactoring easier
 */

export const DEFAULT_API_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const QUERY_KEYS = {
  // Authenticated queries
  ACCOUNTS: ['accounts'],
  PUBLIC_ACCOUNTS: ['accounts', 'public'],
  CONTACTS: ['contacts'],
  ACCOUNT_CONTACTS: ['contacts', 'by-account'],
  USERS: ['users-v2'],
  ORGANIZATION_USERS: (orgId: string) => ['organization-users', orgId],
  ROLES: ['roles'],
  ORGANIZATION_ROLES: (orgId: string) => ['organization-roles', orgId],
  ORGANIZATION_DOCUMENTS: (orgId: string) => ['organization-documents', orgId],
  DOCUMENT_TYPES: ['document-types'],
  DESIGNEES: (orgId: string) => ['designees', orgId],
  SUBMISSIONS: ['submissions'],
  ACCOUNT_SUBMISSIONS: ['submissions', 'by-account'],
  USER_PROFILE: (userId: string) => ['user-profile', userId],
  CONTACT_BY_EMAIL: (email: string) => ['contact-by-email', email],
  CONTACTS_BY_ORG: (orgId: string) => ['contacts', 'organization', orgId],

  // Public queries
  ACCOUNTS_PUBLIC: ['accounts', 'public'],
  CREATE_ACCESS_REQUEST: ['access-request', 'create'],
} as const;

export const STALE_TIMES = {
  PUBLIC_ACCOUNTS: DEFAULT_API_STALE_TIME,
  ACCOUNT_CONTACTS: DEFAULT_API_STALE_TIME,
  ACCOUNT_SUBMISSIONS: DEFAULT_API_STALE_TIME,
  USERS: 10 * 60 * 1000, // 10 minutes
  ORGANIZATION_USERS: 10 * 60 * 1000, // 10 minutes
  ROLES: 10 * 60 * 1000, // 10 minutes
  ORGANIZATION_ROLES: 10 * 60 * 1000, // 10 minutes
  ORGANIZATION_DOCUMENTS: 10 * 60 * 1000, // 10 minutes
  DOCUMENT_TYPES: 10 * 60 * 1000, // 10 minutes
  DESIGNEES: 10 * 60 * 1000, // 10 minutes
} as const;

export const SERVICE_NAMES = {
  PUBLIC_ACCOUNTS: 'accounts',
  ACCOUNT_WITH_CONTACTS: 'account-with-contacts',
  ACCOUNT_CONTACTS: 'account-contacts',
  USERS: 'userProfile',
  ORGANIZATION_USERS: 'organization-users',
  ROLES: 'roles',
  ORGANIZATION_ROLES: 'organization-roles',
  ORGANIZATION_DOCUMENTS: 'organization-documents',
  DOCUMENT_TYPES: 'document-types',
  DESIGNEES: 'designees',
  ACCOUNT_SUBMISSIONS: 'account-submissions',
} as const;
