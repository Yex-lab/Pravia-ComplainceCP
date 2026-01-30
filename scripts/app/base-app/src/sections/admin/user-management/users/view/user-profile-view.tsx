'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ICONS,
  Iconify,
  useRouter,
  ZeroState,
  CustomCard,
  UserAvatar,
  DashboardContent,
  EnhancedFormBuilder,
  useConfirmationDialog,
} from '@asyml8/ui';

import {
  Box,
  Tab,
  Card,
  Link,
  Menu,
  Tabs,
  Button,
  MenuItem,
  Skeleton,
  IconButton,
  Typography,
  Breadcrumbs,
  CardContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslation } from 'src/hooks/use-translation';

import { uiLogger } from 'src/utils/logger.util';

import { useAppStore } from 'src/store';
import { useAuthContext } from 'src/hooks';
import { foundrySlices, foundryServices } from 'src/api';

// ----------------------------------------------------------------------

type Props = {
  userId: string;
};

export function UserProfileView({ userId }: Props) {
  const router = useRouter();
  const confirm = useConfirmationDialog();
  const { user: loggedInUser } = useAuthContext();
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  // Get user from org users in state
  const orgUsers = useAppStore((state) => state.slices.users.data);
  const user = orgUsers.find((u) => u.user?.id === userId);
  const isLoading = !orgUsers || orgUsers.length === 0;

  const queryClient = useQueryClient();

  // Mutations for user actions
  const revokeSessionsMutation = useMutation({
    mutationFn: (id: string) =>
      foundryServices.userManagement.createUserManagementAdminUsersByIdRevokeSessions(id, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foundrySlices.userManagement.query });
      uiLogger.info('Sessions revoked successfully');
    },
    onError: (error) => {
      uiLogger.error('Error revoking sessions:', error);
    },
  });

  const banUserMutation = useMutation({
    mutationFn: (id: string) =>
      foundryServices.userManagement.createUserManagementAdminUsersByIdBan(id, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foundrySlices.userManagement.query });
      uiLogger.info('User deactivated successfully');
    },
    onError: (error) => {
      uiLogger.error('Error deactivating user:', error);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) =>
      foundryServices.userManagement.deleteUserManagementAdminUsersById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foundrySlices.userManagement.query });
      router.push(paths.admin.userManagement.users);
      uiLogger.info('User deleted successfully');
    },
    onError: (error) => {
      uiLogger.error('Error deleting user:', error);
    },
  });

  uiLogger.debug('Profile - userId:', userId);
  uiLogger.debug('Profile - found user:', user);

  // User structure is { user: SupabaseUserDto, profile: UserProfileDto }
  const supabaseUser = user?.user;
  const profile = user?.profile;

  // Get Dataverse contact from state
  const contacts = useAppStore((state) => state.slices.contacts.data);
  const contact = contacts.find(
    (c) => c.email?.toLowerCase() === supabaseUser?.email?.toLowerCase()
  );

  // Initialize edit state on first render
  if (isEditing && !firstName && !lastName && profile) {
    setFirstName(profile?.firstName ?? '');
    setLastName(profile?.lastName ?? '');
  }

  const displayName =
    (profile?.displayName ||
      `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim() ||
      supabaseUser?.email?.split('@')[0]) ??
    'Unknown User';

  const getStatusColor = (confirmed: boolean) => (confirmed ? 'success' : 'warning');
  const getStatusText = (confirmed: boolean) => (confirmed ? 'Active' : 'Pending');

  const loggedInUserName =
    loggedInUser?.displayName ?? loggedInUser?.email?.split('@')[0] ?? 'User';

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleEdit = () => {
    if (isEditing) {
      // Handle save logic here
      uiLogger.debug('Saving profile', { firstName, lastName });
    }
    setIsEditing(!isEditing);
  };

  const handleRevokeSessions = async () => {
    const confirmed = await confirm({
      title: 'Revoke Sessions',
      message: `Are you sure you want to revoke all sessions for ${displayName}? They will be logged out immediately.`,
      confirmText: 'Revoke',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      uiLogger.debug('Revoking sessions for user:', userId);
      revokeSessionsMutation.mutate(userId);
    }
  };

  const handleDeactivateUser = async () => {
    const confirmed = await confirm({
      title: 'Deactivate User',
      message: `Are you sure you want to deactivate ${displayName}? They will not be able to log in.`,
      confirmText: 'Deactivate',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      uiLogger.debug('Deactivating user:', userId);
      banUserMutation.mutate(userId);
    }
  };

  const handleDeleteUser = async () => {
    const confirmed = await confirm({
      title: 'Delete User',
      message: `Are you sure you want to delete ${displayName}? This action cannot be undone.`,
      variant: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      uiLogger.debug('Deleting user:', userId);
      deleteUserMutation.mutate(userId);
    }
  };

  return (
    <DashboardContent maxWidth="lg">
      {/* Navigation */}
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={() => router.back()}
          startIcon={<Iconify icon={'solar:arrow-left-bold' as any} />}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
              bgcolor: 'action.hover',
            },
          }}
        >
          {t('actions.back')}
        </Button>
      </Box>

      <Breadcrumbs sx={{ mb: 4 }}>
        <Link href={paths.dashboard.root} underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link href={paths.admin.userManagement.users} underline="hover" color="inherit">
          Users
        </Link>
        <Typography color="text.primary">{isLoading ? 'User Profile' : displayName}</Typography>
      </Breadcrumbs>

      {isLoading ? (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Skeleton variant="circular" width={80} height={80} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
              </Box>
            </Box>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
          </CardContent>
        </Card>
      ) : !user ? (
        <ZeroState
          icon="solar:user-cross-bold-duotone"
          title="User Not Found"
          description="The user profile you're looking for doesn't exist or may have been removed."
        />
      ) : (
        <>
          {/* Hero Section */}
          <Card
            sx={{
              mb: 4,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}10 100%)`,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent sx={{ pt: 4, pb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
                  <UserAvatar
                    displayName={loggedInUser?.displayName}
                    photoURL={loggedInUser?.photoURL}
                    size={100}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Logged in as: {loggedInUserName}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                      {displayName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                      {supabaseUser?.email ?? 'No email'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant={isEditing ? 'outlined' : 'contained'}
                    onClick={handleEdit}
                    startIcon={
                      <Iconify icon={isEditing ? 'solar:check-circle-bold' : 'solar:pen-bold'} />
                    }
                  >
                    {isEditing ? 'Save' : 'Edit'}
                  </Button>
                  {isEditing && (
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => setIsEditing(false)}
                      startIcon={<Iconify icon={ICONS.CLOSE_CIRCLE} />}
                    >
                      Cancel
                    </Button>
                  )}
                  {!isEditing && (
                    <>
                      <IconButton
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        size="small"
                        sx={{ borderRadius: 1 }}
                      >
                        <Iconify icon={'solar:menu-dots-bold' as any} />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      >
                        <MenuItem
                          onClick={() => {
                            handleRevokeSessions();
                            setAnchorEl(null);
                          }}
                        >
                          <Iconify icon={'solar:power-bold' as any} sx={{ mr: 1 }} />
                          Revoke Sessions
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleDeactivateUser();
                            setAnchorEl(null);
                          }}
                        >
                          <Iconify icon={'solar:close-square-bold' as any} sx={{ mr: 1 }} />
                          Deactivate User
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleDeleteUser();
                            setAnchorEl(null);
                          }}
                          sx={{ color: 'error.main' }}
                        >
                          <Iconify icon={ICONS.TRASH_BIN} sx={{ mr: 1 }} />
                          Delete User
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 3,
              '& .MuiTab-root': {
                textTransform: 'none',
                minHeight: 56,
                fontWeight: 600,
                fontSize: '0.95rem',
              },
            }}
          >
            <Tab label="Overview" icon={<Iconify icon={ICONS.EYE} />} iconPosition="start" />
            <Tab label="Account" icon={<Iconify icon={ICONS.SETTINGS} />} iconPosition="start" />
            {(supabaseUser as any)?.user_metadata &&
              Object.keys((supabaseUser as any).user_metadata).length > 0 && (
                <Tab
                  label="Metadata"
                  icon={<Iconify icon={ICONS.DOCUMENT_TEXT_DUOTONE} />}
                  iconPosition="start"
                />
              )}
          </Tabs>

          {/* Overview Tab */}
          {currentTab === 0 && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                gap: 3,
              }}
            >
              {isEditing ? (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Iconify icon={'solar:user-bold' as any} width={24} />
                      Personal Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Update your basic profile details
                    </Typography>
                  </Box>
                  <EnhancedFormBuilder
                    rows={[
                      {
                        fields: [
                          {
                            id: 'firstName',
                            name: 'firstName',
                            label: 'First Name',
                            type: 'text',
                          },
                          {
                            id: 'lastName',
                            name: 'lastName',
                            label: 'Last Name',
                            type: 'text',
                          },
                        ],
                      },
                    ]}
                    defaultValues={{
                      firstName: profile?.firstName ?? '',
                      lastName: profile?.lastName ?? '',
                    }}
                    onSubmit={(data) => {
                      setFirstName(data.firstName);
                      setLastName(data.lastName);
                      setIsEditing(false);
                    }}
                    hideSubmitButton={false}
                    submitLabel="Save Changes"
                  />
                </Box>
              ) : (
                <CustomCard
                  config={{
                    title: 'Personal Information',
                    subtitle: 'Update your basic profile details',
                    icon: 'solar:user-bold-duotone',
                    data: [
                      {
                        label: 'Full Name',
                        value: displayName,
                      },
                      {
                        label: 'Email',
                        value: supabaseUser?.email ?? '—',
                        type: 'email',
                      },
                      {
                        label: 'First Name',
                        value: profile?.firstName ?? '—',
                      },
                      {
                        label: 'Last Name',
                        value: profile?.lastName ?? '—',
                      },
                    ],
                    layout: {
                      columns: 1,
                    },
                  }}
                />
              )}

              <CustomCard
                config={{
                  title: 'Quick Info',
                  subtitle: 'Account status and verification details',
                  icon: 'solar:info-circle-bold-duotone',
                  data: [
                    {
                      label: 'Status',
                      value: getStatusText(!!supabaseUser?.email_confirmed_at),
                      type: 'label',
                      labelConfig: {
                        color: getStatusColor(!!supabaseUser?.email_confirmed_at),
                        variant: 'outlined',
                      },
                    },
                    {
                      label: 'Email Verified',
                      value: supabaseUser?.email_confirmed_at ? 'Verified' : 'Unverified',
                      type: 'label',
                      labelConfig: {
                        color: supabaseUser?.email_confirmed_at ? 'success' : 'error',
                        variant: 'outlined',
                      },
                    },
                    {
                      label: 'User ID',
                      value: supabaseUser?.id ?? '—',
                      fullWidth: true,
                    },
                  ],
                }}
              />

              <CustomCard
                config={{
                  title: 'Dataverse Contact',
                  subtitle: !contact
                    ? 'No matching contact found in Dataverse'
                    : 'Contact information from Pravia OIS Compliance',
                  icon: 'solar:users-group-rounded-bold-duotone',
                  data: contact
                    ? [
                        {
                          label: 'Full Name',
                          value: contact.fullName ?? '—',
                        },
                        {
                          label: 'Organization',
                          value: (contact as any).organization?.name ?? '—',
                        },
                        {
                          label: 'Job Title',
                          value: contact.jobTitle ?? '—',
                        },
                        {
                          label: 'Phone',
                          value: contact.phone ?? '—',
                        },
                        {
                          label: 'Email',
                          value: contact.email ?? '—',
                          type: 'email',
                        },
                      ]
                    : [],
                  layout: {
                    columns: 1,
                  },
                }}
              />
            </Box>
          )}

          {/* Account Tab */}
          {currentTab === 1 && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                gap: 3,
              }}
            >
              <CustomCard
                config={{
                  title: 'Account Activity',
                  subtitle: 'Login and verification timeline',
                  icon: 'solar:history-bold-duotone',
                  data: [
                    {
                      label: 'Account Created',
                      value: supabaseUser?.created_at
                        ? new Date(supabaseUser.created_at).toLocaleString()
                        : '—',
                      type: 'date',
                    },
                    {
                      type: 'divider',
                    },
                    {
                      label: 'Last Login',
                      value: supabaseUser?.last_sign_in_at
                        ? new Date(supabaseUser.last_sign_in_at).toLocaleString()
                        : 'Never',
                      type: 'date',
                    },
                    {
                      type: 'divider',
                    },
                    {
                      label: 'Email Verification',
                      value: supabaseUser?.email_confirmed_at ? 'Verified' : 'Unverified',
                      type: 'label',
                      labelConfig: {
                        color: supabaseUser?.email_confirmed_at ? 'success' : 'error',
                        variant: 'outlined',
                      },
                    },
                  ],
                }}
              />
            </Box>
          )}

          {/* Metadata Tab */}
          {currentTab === 2 &&
            (supabaseUser as any)?.user_metadata &&
            Object.keys((supabaseUser as any).user_metadata).length > 0 && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                  gap: 3,
                }}
              >
                <CustomCard
                  config={{
                    title: 'User Metadata',
                    subtitle: 'Additional system and profile information',
                    icon: 'solar:code-bold-duotone',
                    data: Object.entries((supabaseUser as any).user_metadata).map(
                      ([key, value]) => {
                        // Convert snake_case to Title Case with spaces
                        const titleCaseLabel = key
                          .split('_')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');
                        return {
                          label: titleCaseLabel,
                          value: typeof value === 'string' ? value : JSON.stringify(value),
                          fullWidth: true,
                        };
                      }
                    ),
                  }}
                />
              </Box>
            )}
        </>
      )}
    </DashboardContent>
  );
}
