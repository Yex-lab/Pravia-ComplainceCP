import type { Column, FilterTab, ActionItem, SearchConfig } from '@asyml8/ui';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ICONS,
  Iconify,
  ChipCell,
  DateCell,
  useRouter,
  DataTable,
  PageHeader,
  SwitchCell,
  ActionsCell,
  AvatarNameCell,
  DashboardContent,
  useConfirmationDialog,
} from '@asyml8/ui';

import { useTranslation } from 'src/hooks/use-translation';

import { uiLogger } from 'src/utils/logger.util';

import { foundrySlices, foundryServices } from 'src/api';
import { type UserFormData } from 'src/store/forms/user.form';

const usersQuery = foundrySlices.userManagement.query;
const usersQueryConfig = foundrySlices.userManagement.queryConfig;

import { AddUserDialog } from '../add-user-dialog';
import { UserFormDialog } from '../user-form-dialog';
import { UserDetailsDrawer } from '../user-details-drawer';

interface User {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt?: string;
  lastSignIn?: string;
  createdAt: string;
  role?: string;
  isSuspended?: boolean;
  supabaseUser?: any;
  profile?: any;
}

const transformApiUser = (apiUser: any): User => {
  try {
    const { supabaseUser, profile } = apiUser || {};

    if (!supabaseUser) {
      uiLogger.warn('Missing supabaseUser in API response:', apiUser);
      return {
        id: 'unknown',
        name: 'Unknown User',
        email: '',
        createdAt: new Date().toISOString(),
      };
    }

    return {
      id: supabaseUser.id,
      name:
        profile?.displayName ||
        `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim() ||
        supabaseUser.email?.split('@')[0] ||
        'Unknown',
      email: supabaseUser.email ?? '',
      emailVerifiedAt: supabaseUser.email_confirmed_at,
      lastSignIn: supabaseUser.last_sign_in_at,
      createdAt: supabaseUser.created_at,
      role: (supabaseUser.user_metadata as any)?.role ?? 'User',
      isSuspended: (supabaseUser.user_metadata as any)?.banned || false,
      supabaseUser,
      profile,
    };
  } catch (error) {
    uiLogger.error('Error transforming user data:', error, apiUser);
    return {
      id: 'error',
      name: 'Error Loading User',
      email: '',
      createdAt: new Date().toISOString(),
    };
  }
};

export function UsersListView() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const confirm = useConfirmationDialog();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserFormData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerUser, setDrawerUser] = useState<any | null>(null);

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) =>
      foundryServices.userManagement.deleteUserManagementAdminUsersById(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQuery });
    },
  });

  const handleAddUser = () => {
    setAddUserDialogOpen(true);
  };

  const handleViewProfile = (user: User) => {
    router.push(`/admin/user-management/users/${user.id}`);
  };

  const handleEditUser = (user: User) => {
    const formData: UserFormData = {
      id: user.id,
      name: user.name,
      email: user.email,
      firstName: (user as any).profile?.firstName ?? '',
      lastName: (user as any).profile?.lastName ?? '',
      role: user.role as 'admin' | 'user' | 'moderator' | undefined,
      active: !!user.emailVerifiedAt,
    };

    setSelectedUser(formData);
    setDialogOpen(true);
  };

  const handleSuspendToggle = async (user: User, suspended: boolean) => {
    try {
      if (suspended) {
        uiLogger.debug('Banning user:', user.id);
      } else {
        uiLogger.debug('Unbanning user:', user.id);
      }
    } catch (error) {
      uiLogger.error('Error toggling suspend:', error);
    }
  };

  const handleRevokeSession = async (userId: string) => {
    try {
      uiLogger.debug('Revoking sessions for user:', userId);
    } catch (error) {
      uiLogger.error('Error revoking sessions:', error);
    }
  };

  const handleDeleteUser = async (user: User) => {
    const confirmed = await confirm({
      title: 'Delete User',
      message: `Are you sure you want to delete ${user.name}? This cannot be undone.`,
      variant: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const columns: Column<User>[] = [
    {
      id: 'name',
      label: t('users.name'),
      sortable: true,
      minWidth: 120,
      maxWidth: 250,
      render: (_, user) => (
        <AvatarNameCell
          name={user.name}
          email={user.email}
          onClick={() => {
            const userData: any = {
              supabaseUser: user.supabaseUser ?? {
                id: user.id,
                email: user.email,
                email_confirmed_at: user.emailVerifiedAt,
                last_sign_in_at: user.lastSignIn,
                created_at: user.createdAt,
                user_metadata: { role: user.role, banned: user.isSuspended },
              },
              profile: user.profile ?? {},
            };
            setDrawerUser(userData);
            setDrawerOpen(true);
          }}
        />
      ),
    },
    {
      id: 'role',
      label: t('users.role'),
      width: 100,
      sortable: true,
      render: (_, user) => (
        <ChipCell
          value={user.role ?? 'User'}
          color={user.role?.toLowerCase() === 'admin' ? 'error' : 'default'}
          variant="outlined"
        />
      ),
    },
    {
      id: 'emailVerifiedAt',
      label: t('users.status'),
      width: 100,
      sortable: true,
      render: (_, user) => (
        <ChipCell
          value={user.emailVerifiedAt ? t('users.verified') : t('users.unverified')}
          color={user.emailVerifiedAt ? 'success' : 'warning'}
          variant="outlined"
        />
      ),
    },
    {
      id: 'lastSignIn',
      label: t('users.lastSignIn'),
      width: 150,
      sortable: true,
      render: (_, user) => <DateCell value={user.lastSignIn} />,
    },
    {
      id: 'isSuspended',
      label: 'Suspended',
      width: 100,
      sortable: true,
      render: (_, user) => (
        <SwitchCell
          checked={user.isSuspended || false}
          onChange={(checked) => handleSuspendToggle(user, checked)}
        />
      ),
    },
    {
      id: 'actions' as keyof User,
      label: '',
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      render: (_, user) => {
        const actions: ActionItem[] = [
          {
            id: 'view',
            label: 'View Profile',
            icon: (<Iconify icon={ICONS.EYE} />) as any,
            onClick: () => handleViewProfile(user),
          },
          {
            id: 'edit',
            label: 'Edit',
            icon: (<Iconify icon={ICONS.PEN} />) as any,
            onClick: () => handleEditUser(user),
          },
          {
            id: 'revoke',
            label: 'Revoke Sessions',
            icon: (<Iconify icon={'solar:power-bold' as any} />) as any,
            onClick: () => handleRevokeSession(user.id),
          },
          {
            id: 'suspend',
            label: user.isSuspended ? 'Unsuspend User' : 'Suspend User',
            icon: (<Iconify icon={'solar:power-bold' as any} />) as any,
            onClick: () => handleSuspendToggle(user, !user.isSuspended),
          },
          {
            id: 'delete',
            label: 'Delete User',
            icon: (<Iconify icon={ICONS.TRASH_BIN} />) as any,
            onClick: () => handleDeleteUser(user),
            color: 'error',
          },
        ];

        return (
          <ActionsCell
            actions={actions}
            moreIcon={(<Iconify icon={'solar:menu-dots-bold' as any} />) as any}
          />
        );
      },
    },
  ];

  const filterTabs: FilterTab<User>[] = [
    {
      id: 'all',
      label: t('users.all'),
      filter: (data) => data,
    },
    {
      id: 'verified',
      label: t('users.verified'),
      filter: (data) => data.filter((user) => user.emailVerifiedAt),
      color: 'success',
    },
    {
      id: 'unverified',
      label: t('users.unverified'),
      filter: (data) => data.filter((user) => !user.emailVerifiedAt),
      color: 'warning',
    },
  ];

  const searchConfig: SearchConfig<User> = {
    placeholder: 'Search users...',
    searchFields: ['name', 'email', 'role'],
    filterOptions: [
      {
        label: 'Role',
        value: 'role',
        options: ['Admin', 'User', 'Manager'],
      },
    ],
  };

  return (
    <DashboardContent>
      <PageHeader
        title={t('users.title')}
        description={t('users.description')}
        breadcrumbs={[
          { label: t('users.breadcrumb.admin') },
          { label: t('users.breadcrumb.users') },
        ]}
        action={{
          label: t('users.add'),
          onClick: handleAddUser,
          icon: <Iconify icon={ICONS.ADD} />,
        }}
      />

      <DataTable
        store={{
          useQuery: () => {
            const query = useQuery({ queryKey: usersQuery, ...usersQueryConfig });
            return {
              ...query,
              data: Array.isArray(query.data) ? query.data.map(transformApiUser) : [],
            };
          },
        }}
        columns={columns}
        getRowId={(user) => user.id}
        filterTabs={filterTabs}
        searchConfig={searchConfig}
        onRowSelect={(selectedIds) => uiLogger.debug('Selected:', selectedIds)}
        labels={{
          search: t('dataTable.search'),
          keyword: t('dataTable.keyword'),
          clear: t('dataTable.clear'),
          resultsFound: t('dataTable.resultsFound'),
          dense: t('dataTable.dense'),
          rowsPerPage: t('dataTable.rowsPerPage'),
        }}
      />

      <UserFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: usersQuery });
        }}
      />

      <AddUserDialog
        open={addUserDialogOpen}
        onClose={() => setAddUserDialogOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: usersQuery });
          setAddUserDialogOpen(false);
        }}
      />

      <UserDetailsDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setDrawerUser(null);
        }}
        user={drawerUser}
        onEdit={() => {
          if (drawerUser) {
            const formData: UserFormData = {
              id: drawerUser.supabaseUser.id,
              name:
                drawerUser.profile?.displayName ??
                (`${drawerUser.profile?.firstName ?? ''} ${drawerUser.profile?.lastName ?? ''}`.trim() ||
                  drawerUser.supabaseUser.email?.split('@')[0]) ??
                'Unknown',
              email: drawerUser.supabaseUser.email,
              firstName: drawerUser.profile?.firstName ?? '',
              lastName: drawerUser.profile?.lastName ?? '',
              role: (drawerUser.supabaseUser.user_metadata as any)?.role as
                | 'admin'
                | 'user'
                | 'moderator'
                | undefined,
              active: !!drawerUser.supabaseUser.email_confirmed_at,
            };
            setSelectedUser(formData);
            setDialogOpen(true);
            setDrawerOpen(false);
          }
        }}
        onViewProfile={() => {
          if (drawerUser) {
            router.push(`/admin/user-management/users/${drawerUser.supabaseUser.id}`);
            setDrawerOpen(false);
          }
        }}
        onSuspend={async () => {
          if (drawerUser) {
            const isSuspended = (drawerUser.supabaseUser.user_metadata as any)?.banned ?? false;
            await handleSuspendToggle(
              {
                id: drawerUser.supabaseUser.id,
                isSuspended,
                name: '',
                email: '',
                createdAt: '',
              },
              !isSuspended
            );
            setDrawerOpen(false);
          }
        }}
        onResetPassword={() => {
          uiLogger.debug('Reset password for user:', drawerUser?.supabaseUser.id);
          setDrawerOpen(false);
        }}
        onResendInvite={() => {
          uiLogger.debug('Resend invite for user:', drawerUser?.supabaseUser.id);
          setDrawerOpen(false);
        }}
        onDelete={async () => {
          if (drawerUser) {
            await handleDeleteUser({
              id: drawerUser.supabaseUser.id,
              name:
                drawerUser.profile?.displayName ??
                drawerUser.supabaseUser.email?.split('@')[0] ??
                'Unknown',
              email: drawerUser.supabaseUser.email,
              createdAt: drawerUser.supabaseUser.created_at,
            });
            setDrawerOpen(false);
          }
        }}
      />
    </DashboardContent>
  );
}
