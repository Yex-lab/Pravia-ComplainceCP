import { useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, InitializeView } from '@asyml8/ui';

import { paths } from 'src/routes/paths';

import { uiLogger } from 'src/utils/logger.util';

import { AppLogo } from 'src/components';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/hooks';
import { SERVICE_NAMES } from 'src/constants';
import { useAppStore } from 'src/store/app.store';
import { AnimatedLayout } from 'src/layouts/animated-layout';
import { getServiceConfigs } from 'src/services/auth-startup.services';

export default function AuthStartupPage() {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const queryClient = useQueryClient();
  const { t } = useTranslate('common');
  const setAuthenticatedStartupComplete = useAppStore(
    (state) => state.setAuthenticatedStartupComplete
  );

  const organizationId = user?.user_metadata?.organization_id;

  const services = useMemo(
    () =>
      user?.id && organizationId ? getServiceConfigs(user.id, organizationId, queryClient) : [],
    [user?.id, organizationId, queryClient]
  );

  useEffect(() => {
    if (!user?.id) {
      router.push(paths.auth.signIn);
    }
  }, [router, user]);

  if (!user?.id) {
    return null;
  }

  return (
    <AnimatedLayout headerBgOpacity={0.1}>
      <InitializeView
        services={services}
        redirectDelay={1500}
        initTimeout={60000}
        errorDisplay="summary"
        onPreInitialize={() => {
          // Placeholder: Add pre-initialization logic here
          // Example: Check auth state, validate prerequisites
          uiLogger.debug('Pre-initialization check');
          return true;
        }}
        onValidate={(results) => {
          // Validate user exists
          if (!user) {
            uiLogger.error('Validation failed: User not found in state');
            throw new Error(t('error.initialization.userNotFound'));
          }

          // Get organizationId from Supabase metadata
          if (!organizationId) {
            uiLogger.error('Validation failed: organization_id not found in user metadata');
            throw new Error(t('error.initialization.organizationNotFound'));
          }

          // Find and store the current account
          const accountsResult = results.find((r) => r.service === SERVICE_NAMES.PUBLIC_ACCOUNTS);
          const currentAccount = accountsResult?.data?.find(
            (account: any) => account.id === organizationId
          );

          // Get contact ID from user metadata
          const contactId = user?.user_metadata?.contact_id;

          // Find current contact by email
          const contactsResult = results.find((r) => r.service === SERVICE_NAMES.ACCOUNT_CONTACTS);
          const userEmail = user?.email;
          const currentContact = contactsResult?.data?.find(
            (contact: any) => contact.email === userEmail
          );
          uiLogger.debug('Found currentContact:', currentContact);

          // Find contact roles for this user
          const organizationRolesResult = results.find(
            (r) => r.service === SERVICE_NAMES.ORGANIZATION_ROLES
          );
          const contactRoles =
            organizationRolesResult?.data?.filter((role: any) => role.contactId === contactId) ||
            [];

          // Find assigned document types for this user
          const organizationDocsResult = results.find(
            (r) => r.service === SERVICE_NAMES.ORGANIZATION_DOCUMENTS
          );
          const contactAssignedDocumentTypes =
            organizationDocsResult?.data?.filter((doc: any) => doc.contactId === contactId) || [];

          // Store organizationId, currentAccount, contactRoles, and contactAssignedDocumentTypes in appConfig
          useAppStore.getState().setAppConfig({
            organizationId,
            currentAccount,
            currentContact,
            contactRoles,
            contactAssignedDocumentTypes,
          });

          return true;
        }}
        onSuccess={() => {
          setAuthenticatedStartupComplete(true);
          // Check for saved return route
          const returnRoute = sessionStorage.getItem('returnRoute');
          if (returnRoute) {
            sessionStorage.removeItem('returnRoute');
            router.push(returnRoute);
          } else {
            router.push(paths.dashboard.root);
          }
        }}
        onError={(errors) => {
          uiLogger.error('Initialization failed:', errors);
          setAuthenticatedStartupComplete(false);
          // Errors are now shown inline in InitializeView
        }}
        logo={<AppLogo width={64} height={64} />}
        buttonSx={{ px: 4, py: 1.5, borderRadius: '12px' }}
        containerSx={{ bgcolor: 'transparent' }}
        onLogout={logout}
        systemUnavailableText={t('error.serverError.title')}
        failedText={t('error.initialization.title')}
        retryText={t('error.initialization.retry')}
      />
    </AnimatedLayout>
  );
}
