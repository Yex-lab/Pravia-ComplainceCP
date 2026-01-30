import type { Column, FilterTab, ActionItem } from '@asyml8/ui';
import type { FluxTypes, FoundryTypes } from '@asyml8/api-types';

import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Contact = FluxTypes.ContactResponseDto;

import {
  ICONS,
  Iconify,
  TextCell,
  showInfo,
  PhoneCell,
  DataTable,
  showError,
  PageHeader,
  ActionsCell,
  showSuccess,
  DashboardContent,
  ContactAvatarCell,
  ContactStatusChip,
  showExpandableError,
  dismissNotification,
  useConfirmationDialog,
} from '@asyml8/ui';

import { Box, CircularProgress } from '@mui/material';

import { useTranslation } from 'src/hooks/use-translation';
import { usePermissions } from 'src/hooks/use-permissions';
import { useAuthContext } from 'src/hooks/use-auth-context';

import { fluxServices, foundryServices } from 'src/api';
import {
  useAppStore,
  useRolesData,
  useAccountsData,
  useContactsData,
  useContactsWithStatusData,
} from 'src/store';

import { ContactFormDialog } from '../contact-form-drawer';

export function ContactsListView() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const { hasPermission, userRole, isBasicUser } = usePermissions();

  console.log('Contacts - userRole:', userRole);
  console.log('Contacts - isBasicUser:', isBasicUser);
  console.log('Contacts - hasPermission(delete_contacts):', hasPermission('delete_contacts'));
  console.log('Contacts - hasPermission(edit_contacts):', hasPermission('edit_contacts'));
  console.log('Contacts - userRole:', userRole);

  const confirm = useConfirmationDialog();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [invitingContactId, setInvitingContactId] = useState<string | null>(null);

  // Sync selection with app store
  const setSelectedContactIds = useAppStore((state) => state.setSelectedContactIds);

  // Get roles and organization roles
  const roles = useRolesData();
  const organizationRoles = useAppStore((state) => state.slices.organizationRoles.data);

  // Get organization data to check primary contact
  const accountsData = useAccountsData();
  const organization = accountsData?.[0];
  const primaryContactId = organization?.primaryContactId;
  const accountId = organization?.id;

  const userContactId =
    (user as any)?.user_metadata?.contact_id ||
    (user as any)?.user_metadata?.contactId ||
    (user as any)?.user_metadata?.contactid;

  /**
   * Mutation to update the primary contact for an account
   * - Calls API to update primary contact
   * - Updates local accounts slice with new primaryContactId
   * - Invalidates related queries to refresh data
   */
  const setPrimaryContactMutation = useMutation({
    mutationFn: (newPrimaryContactId: string) =>
      fluxServices.accounts.updateAccountsByIdPrimaryContact(accountId!, {
        primaryContactId: newPrimaryContactId,
      }),
    onSuccess: (data) => {
      // Update accounts slice with new primary contact
      const accountsSlice = useAppStore.getState().slices.accounts;
      const updatedAccounts = accountsSlice.data.map((acc) =>
        acc.id === accountId ? { ...acc, primaryContactId: data.primaryContactId } : acc
      );
      accountsSlice.setData(updatedAccounts);

      queryClient.invalidateQueries({ queryKey: ['accounts-with-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['account-with-contacts', accountId] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      showSuccess('Primary contact updated');
    },
    onError: (e: any) => {
      showError(e?.message ?? 'Failed to update primary contact');
    },
  });

  // Helper to convert name to Pascal Case
  const toPascalCase = (name: string) => {
    if (!name || name === '-' || name === 'Unknown') return name;
    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get contacts from slice (loaded at startup)
  const contactsData = useContactsData();
  const isLoading = contactsData.length === 0;
  const userEmail = user?.email || (user as any)?.user_metadata?.email;

  const myContactId = useMemo(() => {
    if (!userEmail) return null;
    const me = contactsData.find((c) => (c.email ?? '').toLowerCase() === userEmail.toLowerCase());
    return me?.id ?? null;
  }, [contactsData, userEmail]);

  const isUserPrimary = Boolean(
    myContactId && primaryContactId && myContactId === primaryContactId
  );

  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    if (!contactsData) return [];

    // NOTE: Temporarily disabled - excluding current user from contacts list
    // This was preventing the logged-in user's contact from being visible
    return contactsData.sort((a, b) => {
      const dateA = a.createdOn ? new Date(a.createdOn).getTime() : 0;
      const dateB = b.createdOn ? new Date(b.createdOn).getTime() : 0;
      return dateB - dateA;
    });
  }, [contactsData]);

  // Get contacts with status derived from users data
  const { contacts: contactsForStatus, users: orgUsers } = useContactsWithStatusData();

  const contactsWithStatus = useMemo(
    () =>
      contactsForStatus.map((contact) => {
        const userRecord = orgUsers.find(
          (u) => u.user?.email?.toLowerCase() === contact.email?.toLowerCase()
        );

        let status: 'not_registered' | 'pending' | 'confirmed' | 'banned' = 'not_registered';

        if (userRecord?.user) {
          // Check if banned first
          if ((userRecord.user as any).user_metadata?.banned) {
            status = 'banned';
          } else if (userRecord.user.email_confirmed_at) {
            status = 'confirmed';
          } else {
            status = 'pending';
          }
        }

        return { ...contact, status };
      }),
    [contactsForStatus, orgUsers]
  );

  const handleAddContact = () => {
    setSelectedContact(null);
    setDialogOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setDialogOpen(true);
  };

  /**
   * Handles assigning a new primary contact for the organization
   *
   * Validation:
   * - Requires accountId to be present
   * - Only current primary contact can assign a new primary contact
   * - Cannot assign if contact is already primary
   *
   * Flow:
   * 1. Shows loading notification with progress indicator
   * 2. Calls mutation to update primary contact via API
   * 3. Dismisses loading notification on completion
   * 4. Success/error messages handled by mutation callbacks
   */
  const handleMakePrimary = async (contact: Contact) => {
    if (!accountId) {
      showError('Account ID not found');
      return;
    }

    if (!isUserPrimary) {
      showError('Only the current primary contact can assign a new primary contact');
      return;
    }

    if (contact.id === primaryContactId) {
      showSuccess('This contact is already the primary contact');
      return;
    }

    const loadingId = showInfo('Updating primary contact...', {
      duration: null,
      icon: <CircularProgress size={20} />,
    });

    try {
      await setPrimaryContactMutation.mutateAsync(contact.id);
    } catch {
      // onError handled by mutation
    } finally {
      dismissNotification(loadingId);
    }
  };

  /**
   * Handles inviting a contact to register in the system
   *
   * Flow:
   * 1. Validates organization ID exists
   * 2. Checks for restricted email domains (e.g., .ca.gov)
   * 3. Sends invitation via API
   * 4. Mutates users state with new user data (no query invalidation)
   * 5. Auto-assigns "Basic User" role to invited user
   * 6. Updates organizationRoles state
   *
   * Note: Uses state mutation instead of query invalidation for immediate UI updates
   */
  const handleInviteContact = async (contact: Contact) => {
    setInvitingContactId(contact.id);
    try {
      const organizationId = (user as any)?.user_metadata?.organization_id;

      if (!organizationId) {
        showError('Organization ID not found');
        setInvitingContactId(null);
        return;
      }

      // Check for restricted domains
      const restrictedDomains = (import.meta.env.VITE_RESTRICTED_EMAIL_DOMAINS || '.ca.gov')
        .split(',')
        .map((d: string) => d.trim());

      const hasRestrictedDomain = restrictedDomains.some((domain) =>
        contact.email.includes(domain)
      );

      if (hasRestrictedDomain) {
        const domainList = restrictedDomains.join(', ');
        await confirm({
          title: t('contacts.invite.restrictedDomain.title'),
          message: t('contacts.invite.restrictedDomain.message', { domains: domainList }),
          variant: 'warning',
          confirmText: t('common.ok'),
        });
        setInvitingContactId(null);
        return;
      }

      // Not sure we need this for adding new contact
      /*
 
      // Get assigned roles for this contact
      const contactRoles = organizationRoles
        .filter((r: any) => r.contactId === contact.id)
        .map((r: any) => r.roleId);

      // Get the first role name from assigned roles (no default fallback)
      let roleName = null;
      if (contactRoles.length > 0) {
        const roleRecord = roles.find((r: any) => r.id === contactRoles[0]);
        if (roleRecord) {
          roleName = roleRecord.name.toLowerCase();
        }
      }
      // Skip invitation if no role is assigned
      if (!roleName) {
        showError(`Cannot invite ${contact.email}: No role assigned to this contact`);
        setInvitingContactId(null);
        return;
      }
*/
      const displayName =
        `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || contact.fullName || 'User';

      const inviteData: FoundryTypes.InviteUserDto = {
        email: contact.email,
        data: {
          first_name: contact.firstName,
          last_name: contact.lastName,
          display_name: displayName,
          // role: roleName,
          organization_id: organizationId,
        },
        redirectTo: import.meta.env.VITE_INVITE_REDIRECT_URL,
      };

      const response =
        await foundryServices.userManagement.createUserManagementAdminUsersInvite(inviteData);

      // Mutate users state with new user data
      // Response may be wrapped in body property by HTTP interceptor
      const responseData: FoundryTypes.CreateUserResponseDto = (response as any)?.body || response;

      if (responseData?.user) {
        const currentUsers = useAppStore.getState().slices.users.data;
        const newUserEntry = {
          user: responseData.user,
          profile: responseData.profile || null,
        };
        useAppStore.getState().slices.users.setData([...currentUsers, newUserEntry]);

        // Assign "Basic User" role to the invited user
        const defaultRoles = useAppStore.getState().slices.roles.data;
        const basicUserRole = defaultRoles.find((role) => role.name === 'Basic User');

        if (basicUserRole && contact.id && accountId) {
          const roleAssignment =
            await fluxServices.organizationMembers.createOrganizationMembersRoles({
              organizationId: accountId,
              contactId: contact.id,
              roleId: basicUserRole.id,
            });

          // Update organization roles state
          const currentOrgRoles = useAppStore.getState().slices.organizationRoles.data;
          useAppStore
            .getState()
            .slices.organizationRoles.setData([...currentOrgRoles, roleAssignment]);
        }
      }

      showSuccess(`Invitation sent successfully to ${contact.email}`);
      setInvitingContactId(null);
    } catch (error) {
      showExpandableError('Failed to send invitation', [
        {
          service: 'User Invitation',
          message: `${String(error)}. Please check the contact information and try again.`,
        },
      ]);
      setInvitingContactId(null);
    }
  };

  /**
   * Handles banning or unbanning a user
   *
   * Flow:
   * 1. Shows confirmation dialog with action details
   * 2. Finds user record by email
   * 3. Calls ban/unban API endpoint
   * 4. Mutates users state to update banned flag (no query invalidation)
   *
   * Note: Ban duration is set to 876000h (100 years) for permanent ban
   */
  const handleBanAction = async (contact: Contact, action: 'ban' | 'unban') => {
    const name =
      contact.fullName ||
      `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim() ||
      'Unknown';

    const confirmed = await confirm({
      title: t(`contacts.${action}.title`),
      message: t(`contacts.${action}.message`, { name }),
      variant: action === 'ban' ? 'danger' : 'warning',
      confirmText: t(`contacts.${action}.confirm`),
      cancelText: t(`contacts.${action}.cancel`),
    });

    if (confirmed) {
      try {
        const userRecord = orgUsers.find(
          (u) => u.user?.email?.toLowerCase() === contact.email?.toLowerCase()
        );

        if (userRecord?.user?.id) {
          if (action === 'ban') {
            await foundryServices.userManagement.createUserManagementAdminUsersByIdBan(
              userRecord.user.id,
              { duration: '876000h' }
            );
          } else {
            await foundryServices.userManagement.deleteUserManagementAdminUsersByIdUnban(
              userRecord.user.id
            );
          }

          // Mutate users state to update banned status
          const currentUsers = useAppStore.getState().slices.users.data;
          const updatedUsers = currentUsers.map((u) => {
            if (u.user?.id === userRecord.user.id) {
              return {
                ...u,
                user: {
                  ...u.user,
                  user_metadata: {
                    ...(u.user as any).user_metadata,
                    banned: action === 'ban',
                  },
                } as any,
              };
            }
            return u;
          });
          useAppStore.getState().slices.users.setData(updatedUsers);

          showSuccess(t(`contacts.${action}.success`, { name }));
        }
      } catch (error) {
        showError(t(`contacts.${action}.error: ${error}`));
      }
    }
  };

  const handleDeleteContact = async (contact: Contact) => {
    const name =
      contact.fullName ||
      `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim() ||
      'Unknown';
    const confirmed = await confirm({
      title: t('contacts.delete.title'),
      message: t('contacts.delete.message', { name }),
      variant: 'danger',
      confirmText: t('contacts.delete.confirm'),
      cancelText: t('contacts.delete.cancel'),
    });

    if (confirmed) {
      try {
        await fluxServices.contacts.deleteContactsById(contact.id);
      } catch {
        // Error handling for delete
      }
    }
  };

  const columns: Column<Contact>[] = [
    {
      id: 'id' as keyof Contact,
      label: t('contacts.columns.name'),
      maxWidth: 250,
      sortable: true,
      render: (_, contact) => {
        const name =
          contact.fullName ||
          `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim() ||
          'Unknown';
        const pascalName = toPascalCase(name);
        const isLoggedInUser = contact.email?.toLowerCase() === user?.email?.toLowerCase();
        const canEdit = hasPermission('edit_contacts') || isLoggedInUser;

        return (
          <ContactAvatarCell
            name={pascalName}
            email={contact.email}
            onClick={canEdit ? () => handleEditContact(contact) : undefined}
            isPrimary={contact.id === primaryContactId}
            isLoggedInUser={isLoggedInUser}
            primaryLabel={t('contacts.filters.primary')}
          />
        );
      },
    },
    {
      id: 'jobTitle',
      label: t('contacts.columns.jobTitle'),
      maxWidth: 200,
      sortable: true,
      render: (_, contact) => (
        <Box
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <TextCell value={contact.jobTitle} />
        </Box>
      ),
    },
    {
      id: 'phone',
      label: t('contacts.columns.phone'),
      sortable: true,
      render: (_, contact) => (
        <PhoneCell value={contact.phone} extension={contact.businessPhoneExtension} type="phone" />
      ),
    },
    {
      id: 'mobilePhone',
      label: 'Mobile',
      sortable: true,
      render: (_, contact) => <PhoneCell value={contact.mobilePhone} type="mobile" />,
    },
    {
      id: 'status' as keyof Contact,
      label: t('contacts.columns.status'),
      sortable: true,
      render: (_, contact) => {
        // Find status from contactsWithStatus
        const contactWithStatus = contactsWithStatus.find((c) => c.id === contact.id);
        const isInviting = invitingContactId === contact.id;

        return (
          <ContactStatusChip
            email={contact.email}
            status={contactWithStatus?.status as any}
            isLoading={isInviting}
            loadingLabel={t('contacts.status.sending')}
          />
        );
      },
    },
    {
      id: 'actions' as keyof Contact,
      label: '',
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      render: (_, contact) => {
        // Find status from contactsWithStatus
        const contactWithStatus = contactsWithStatus.find((c) => c.id === contact.id);
        const isNotRegistered = contactWithStatus?.status === 'not_registered';
        const isThisContactRegistered = contactWithStatus?.status === 'confirmed';
        const isBanned = contactWithStatus?.status === 'banned';
        const isLoggedInUser = contact.email?.toLowerCase() === user?.email?.toLowerCase();
        const isThisContactPrimary = contact.id === primaryContactId;
        const canMakePrimary = isUserPrimary && !isThisContactPrimary && isThisContactRegistered;
        const actions: ActionItem[] = [
          // Edit action - if user has permission OR if it's their own contact
          ...(hasPermission('edit_contacts') || isLoggedInUser
            ? [
                {
                  id: 'edit',
                  label: t('contacts.actions.edit'),
                  icon: ICONS.PEN,
                  onClick: () => handleEditContact(contact),
                },
              ]
            : []),
          // Make Primary - only if user is primary and contact is registered and not already primary
          ...(canMakePrimary
            ? [
                {
                  id: 'make-primary',
                  label: t('contacts.actions.makePrimary'),
                  icon: ICONS.SHIELD_CHECK,
                  onClick: () => handleMakePrimary(contact),
                  color: 'primary' as const,
                },
              ]
            : []),
          // Only show invite button for not registered users and if user has permission
          ...(isNotRegistered && hasPermission('create_contacts')
            ? [
                {
                  id: 'invite',
                  label: t('contacts.actions.invite'),
                  icon: ICONS.SEND,
                  onClick: () => handleInviteContact(contact),
                  color: 'primary' as const,
                },
              ]
            : []),
          // Show ban for registered users (not logged in user) - admin only
          // ...(isThisContactRegistered && !isLoggedInUser && hasPermission('delete_contacts')
          //   ? [
          //       {
          //         id: 'ban',
          //         label: t('contacts.actions.ban'),
          //         icon: ICONS.CLOSE_CIRCLE,
          //         onClick: () => handleBanAction(contact, 'ban'),
          //         color: 'error' as const,
          //       },
          //     ]
          //   : []),
          // Show unban for banned users - admin only
          // ...(isBanned && hasPermission('delete_contacts')
          //   ? [
          //       {
          //         id: 'unban',
          //         label: t('contacts.actions.unban'),
          //         icon: ICONS.CHECK_CIRCLE,
          //         onClick: () => handleBanAction(contact, 'unban'),
          //         color: 'warning' as const,
          //       },
          //     ]
          //   : []),
          // Delete action - only if user has permission
          ...(hasPermission('delete_contacts')
            ? [
                {
                  id: 'delete',
                  label: t('contacts.actions.delete'),
                  icon: ICONS.TRASH_BIN,
                  onClick: () => handleDeleteContact(contact),
                  color: 'error' as const,
                },
              ]
            : []),
        ];

        return <ActionsCell actions={actions} moreIcon={ICONS.MORE_VERTICAL} />;
      },
    },
  ];

  const filterTabs: FilterTab<Contact>[] = [
    {
      id: 'all',
      label: t('contacts.filters.all'),
      filter: (data) => data,
    },
    {
      id: 'my-contact',
      label: t('contacts.filters.myContact'),
      filter: (data) =>
        data.filter((contact) => contact.email?.toLowerCase() === user?.email?.toLowerCase()),
      color: 'secondary',
    },
    {
      id: 'primary',
      label: t('contacts.filters.primary'),
      filter: (data) => data.filter((contact) => contact.id === primaryContactId),
      color: 'success',
    },
    {
      id: 'registered',
      label: t('contacts.filters.registered'),
      filter: (data) =>
        data.filter((contact) => {
          const contactWithStatus = contactsWithStatus.find((c) => c.id === contact.id);
          return contactWithStatus?.status === 'confirmed';
        }),
      color: 'info',
    },
    {
      id: 'pending',
      label: t('contacts.filters.pending'),
      filter: (data) =>
        data.filter((contact) => {
          const contactWithStatus = contactsWithStatus.find((c) => c.id === contact.id);
          return contactWithStatus?.status === 'pending';
        }),
      color: 'warning',
    },
    {
      id: 'not-registered',
      label: t('contacts.filters.notRegistered'),
      filter: (data) =>
        data.filter((contact) => {
          const contactWithStatus = contactsWithStatus.find((c) => c.id === contact.id);
          return contactWithStatus?.status === 'not_registered';
        }),
      color: 'default',
    },
  ];

  return (
    <DashboardContent>
      <PageHeader
        title={t('nav.contacts')}
        description="Designated organization contacts"
        breadcrumbs={[{ label: t('nav.workspace') }, { label: t('nav.contacts') }]}
        action={
          hasPermission('create_contacts')
            ? {
                label: 'Add Contact',
                onClick: handleAddContact,
                icon: <Iconify icon={ICONS.ADD} />,
              }
            : undefined
        }
      />

      <Box
        sx={{
          flex: '0 0 auto',
          ...(!hasPermission('delete_contacts') && {
            '& .MuiCheckbox-root': { display: 'none' },
            '& th:first-of-type, & td:first-of-type': { display: 'none' },
          }),
        }}
      >
        <DataTable
          key="contacts-table"
          store={{
            useQuery: () => ({
              data: filteredContacts,
              isLoading,
              error: null,
              refetch: () => {},
            }),
          }}
          columns={columns}
          getRowId={(contact) => String(contact.id)}
          filterTabs={filterTabs}
          searchConfig={{
            placeholder: 'Search contacts...',
            searchFields: ['firstName', 'lastName', 'email', 'phone', 'jobTitle', 'mobilePhone'],
          }}
          onRefresh={async () => {
            const organizationId = (user as any)?.user_metadata?.organization_id;
            if (organizationId) {
              const data = await queryClient.fetchQuery({
                queryKey: ['contacts', 'by-account'],
                queryFn: () =>
                  fluxServices.contacts.getContactsByAccountByAccountId(organizationId),
              });
              useAppStore.getState().slices.contacts.setData(data);
            }
          }}
          refreshTooltip={t('actions.refresh')}
          {...(hasPermission('delete_contacts') && { onRowSelect: setSelectedContactIds })}
        />
      </Box>

      <ContactFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        contact={selectedContact}
        accountId={accountId ?? ''}
        primaryContactId={primaryContactId ?? null}
      />
    </DashboardContent>
  );
}
