import type { QueryClient } from '@tanstack/react-query';

import i18n from 'src/lib/i18n';
import { fluxServices } from 'src/api/flux.api';
import { foundryServices } from 'src/api/foundry.api';
import { QUERY_KEYS, STALE_TIMES, SERVICE_NAMES } from 'src/constants';

import { useAppStore } from '../store/app.store';

export interface ServiceConfig {
  name: string;
  fn: () => Promise<any>;
  setter: (data: any) => void;
  critical: boolean;
  message: string;
}

export const getServiceConfigs = (
  userId: string,
  organizationId: string,
  queryClient: QueryClient
): ServiceConfig[] => {
  const store = useAppStore.getState();

  return [
    {
      name: SERVICE_NAMES.USERS,
      fn: () => foundryServices.userManagement.getUserManagementAdminUsersByIdWithProfile(userId),
      setter: (data) => {
        store.setAppConfig({ ...store.appConfig, currentUser: data });
      },
      critical: true,
      message: i18n.t('startup.retrievingProfile', { ns: 'common' }),
    },
    {
      name: SERVICE_NAMES.ORGANIZATION_USERS,
      fn: () =>
        queryClient.fetchQuery({
          queryKey: QUERY_KEYS.ORGANIZATION_USERS(organizationId),
          queryFn: () =>
            foundryServices.userManagement.getUserManagementAdminUsersOrganizationByOrganizationId(
              organizationId
            ),
          staleTime: STALE_TIMES.ORGANIZATION_USERS,
        }),
      setter: (data) => {
        store.slices.users.setData(data);
      },
      critical: false,
      message: i18n.t('startup.retrievingOrganizationUsers', { ns: 'common' }),
    },
    {
      name: SERVICE_NAMES.ROLES,
      fn: () =>
        queryClient.fetchQuery({
          queryKey: QUERY_KEYS.ROLES,
          queryFn: () => foundryServices.roles.getRoles(),
          staleTime: STALE_TIMES.ROLES,
        }),
      setter: (data) => {
        store.slices.roles.setData(data);
      },
      critical: false,
      message: i18n.t('startup.retrievingRoles', { ns: 'common' }),
    },
    {
      name: SERVICE_NAMES.ORGANIZATION_ROLES,
      fn: () =>
        queryClient.fetchQuery({
          queryKey: QUERY_KEYS.ORGANIZATION_ROLES(organizationId),
          queryFn: () =>
            fluxServices.organizationMembers.getOrganizationMembersRolesOrganizationByOrganizationId(
              organizationId
            ),
          staleTime: STALE_TIMES.ORGANIZATION_ROLES,
        }),
      setter: (data) => {
        store.slices.organizationRoles.setData(data);
      },
      critical: false,
      message: i18n.t('startup.retrievingOrganizationRoles', { ns: 'common' }),
    },
    {
      name: SERVICE_NAMES.ORGANIZATION_DOCUMENTS,
      fn: () =>
        queryClient.fetchQuery({
          queryKey: QUERY_KEYS.ORGANIZATION_DOCUMENTS(organizationId),
          queryFn: () =>
            fluxServices.organizationMembers.getOrganizationMembersDocumentsOrganizationByOrganizationId(
              organizationId
            ),
          staleTime: STALE_TIMES.ORGANIZATION_DOCUMENTS,
        }),
      setter: (data) => {
        store.slices.organizationDocuments.setData(data);
      },
      critical: false,
      message: i18n.t('startup.retrievingOrganizationDocuments', { ns: 'common' }),
    },
    {
      name: SERVICE_NAMES.PUBLIC_ACCOUNTS,
      fn: () =>
        queryClient.fetchQuery({
          queryKey: QUERY_KEYS.PUBLIC_ACCOUNTS,
          queryFn: () => fluxServices.public.getPublicAccounts(),
          staleTime: STALE_TIMES.PUBLIC_ACCOUNTS,
        }),
      setter: (data) => {
        store.slices.accountsPublic.setData(data);
        // Also populate accounts slice with user's organization
        const userAccount = data.find((acc: any) => acc.id === organizationId);
        if (userAccount) {
          store.slices.accounts.setData([userAccount]);
        }
      },
      critical: true,
      message: i18n.t('startup.retrievingOrganization', { ns: 'common' }),
    },
    {
      name: SERVICE_NAMES.ACCOUNT_WITH_CONTACTS,
      fn: () =>
        queryClient.fetchQuery({
          queryKey: ['accounts', organizationId, 'with-contacts'],
          queryFn: () => fluxServices.accounts.getAccountsByIdWithContacts(organizationId),
          staleTime: STALE_TIMES.ACCOUNT_CONTACTS,
        }),
      setter: (data) => {
        // Update accounts slice with full account data including contacts
        store.slices.accounts.setData([data]);
      },
      critical: false,
      message: i18n.t('startup.retrievingOrganizationDetails', { ns: 'common' }),
    },
    {
      name: SERVICE_NAMES.ACCOUNT_CONTACTS,
      fn: () =>
        queryClient.fetchQuery({
          queryKey: QUERY_KEYS.ACCOUNT_CONTACTS,
          queryFn: () => fluxServices.contacts.getContactsByAccountByAccountId(organizationId),
          staleTime: STALE_TIMES.ACCOUNT_CONTACTS,
        }),
      setter: (data) => {
        store.slices.contacts.setData(data);
      },
      critical: false,
      message: i18n.t('startup.retrievingContacts', { ns: 'common' }),
    },
    {
      name: SERVICE_NAMES.ACCOUNT_SUBMISSIONS,
      fn: () =>
        queryClient.fetchQuery({
          queryKey: QUERY_KEYS.ACCOUNT_SUBMISSIONS,
          queryFn: () =>
            fluxServices.submissions.getSubmissionsByAccountByAccountId(organizationId),
          staleTime: STALE_TIMES.ACCOUNT_SUBMISSIONS,
        }),
      setter: (data) => {
        store.slices.submissions.setData(data);
      },
      critical: false,
      message: i18n.t('startup.retrievingSubmissions', { ns: 'common' }),
    },
    {
      name: SERVICE_NAMES.DOCUMENT_TYPES,
      fn: () =>
        queryClient.fetchQuery({
          queryKey: QUERY_KEYS.DOCUMENT_TYPES,
          queryFn: () => fluxServices.documentTypes.getDocumentTypes(),
          staleTime: STALE_TIMES.DOCUMENT_TYPES,
        }),
      setter: (data) => {
        store.slices.documentTypes.setData(data);
      },
      critical: false,
      message: i18n.t('startup.retrievingDocumentTypes', { ns: 'common' }),
    },
    {
      name: SERVICE_NAMES.DESIGNEES,
      fn: () =>
        queryClient.fetchQuery({
          queryKey: QUERY_KEYS.DESIGNEES(organizationId),
          queryFn: () =>
            fluxServices.designees.getDesigneesOrganizationByOrganizationId(organizationId),
          staleTime: STALE_TIMES.DESIGNEES,
        }),
      setter: (data) => {
        store.slices.designees.setData(data);
      },
      critical: false,
      message: i18n.t('startup.retrievingDesignees', { ns: 'common' }),
    },
  ];
};
