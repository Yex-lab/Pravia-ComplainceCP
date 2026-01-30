import { useMemo } from 'react';

import { useAuthContext } from './use-auth-context';

export type Permission =
  | 'view_organization'
  | 'edit_organization'
  | 'create_contacts'
  | 'edit_contacts'
  | 'delete_contacts'
  | 'create_submissions'
  | 'edit_submissions'
  | 'delete_submissions'
  | 'view_contacts'
  | 'view_submissions';

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  'system admin': [
    'view_organization',
    'edit_organization',
    'create_contacts',
    'edit_contacts',
    'delete_contacts',
    'create_submissions',
    'edit_submissions',
    'delete_submissions',
    'view_contacts',
    'view_submissions',
  ],
  admin: [
    'view_organization',
    'edit_organization',
    'create_contacts',
    'edit_contacts',
    'delete_contacts',
    'create_submissions',
    'edit_submissions',
    'delete_submissions',
    'view_contacts',
    'view_submissions',
  ],
  'basic user': ['view_organization', 'view_contacts', 'view_submissions'],
};

export function usePermissions() {
  const { user } = useAuthContext();

  const userRole = useMemo(() => {
    const metadata = (user as any)?.user_metadata;
    const role = metadata?.role || metadata?.role_user;
    return role ? role.toLowerCase() : 'basic user';
  }, [user]);

  const permissions = useMemo(
    () => ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS['basic user'],
    [userRole]
  );

  const hasPermission = (permission: Permission): boolean => permissions.includes(permission);

  const hasAnyPermission = (...perms: Permission[]): boolean =>
    perms.some((p) => permissions.includes(p));

  const hasAllPermissions = (...perms: Permission[]): boolean =>
    perms.every((p) => permissions.includes(p));

  return {
    userRole,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isBasicUser: userRole === 'basic user',
    isAdmin: userRole === 'admin' || userRole === 'system admin',
  };
}
