import type { FluxTypes } from '@asyml8/api-types';

import { useRef, useState } from 'react';
import {
  ICONS,
  Iconify,
  PageHeader,
  CustomCard,
  FeatureDrawer,
  DashboardContent,
  EnhancedFormBuilder,
} from '@asyml8/ui';

import { Stack, Button } from '@mui/material';

import { useTranslation } from 'src/hooks/use-translation';
import { usePermissions } from 'src/hooks/use-permissions';

import { organizationAddressStore } from 'src/store/forms/organization.form';
import { useAppConfig, useContactsData, useAccountsData, useAccountsPublicData } from 'src/store';

import {
  getAddressFieldRows,
  getPrimaryAddressConfig,
  getMailingAddressConfig,
  getOrganizationDetailConfig,
} from './organization-list-view.config';

type AccountDto = FluxTypes.AccountDto;

export function OrganizationListView() {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const { organizationId } = useAppConfig();
  const formRef = useRef<HTMLFormElement>(null);

  const [editingAddress, setEditingAddress] = useState<'primary' | 'mailing' | null>(null);

  // Get accounts data from slice (loaded at startup with user's organization)
  const accounts = useAccountsData();
  const account = accounts.find((acc) => acc.id === organizationId);
  const loading = !account && accounts.length === 0;

  const contacts = useContactsData();

  // Get all public accounts to find parent organization
  const publicAccounts = useAccountsPublicData();

  // Find primary contact name
  const primaryContact = contacts.find((contact) => contact.id === account?.primaryContactId);
  const primaryContactName = primaryContact?.fullName;

  // Find parent account name from public accounts
  const parentAccount = publicAccounts.find((acc) => acc.id === account?.parentAccountId);
  const parentAccountName = parentAccount?.name;

  const handleEditAddress = (type: 'primary' | 'mailing') => {
    setEditingAddress(type);
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
  };

  const handleSuccess = () => {
    setEditingAddress(null);
  };

  const organizationDetailConfig = getOrganizationDetailConfig(
    t,
    account,
    parentAccountName,
    primaryContactName
  );

  const canEditOrg = hasPermission('edit_organization');
  const primaryAddressConfig = getPrimaryAddressConfig(
    t,
    account,
    canEditOrg ? handleEditAddress : undefined
  );

  const mailingAddressConfig = getMailingAddressConfig(
    t,
    account,
    canEditOrg ? handleEditAddress : undefined
  );

  const isPrimaryAddress = editingAddress === 'primary';

  // Trim whitespace from account data for form
  const trimmedAccount = account
    ? {
        ...account,
        state: account.state?.trim(),
        county: account.county?.trim(),
        mailingState: account.mailingState?.trim(),
        mailingCounty: account.mailingCounty?.trim(),
      }
    : undefined;

  const drawerTitle = isPrimaryAddress
    ? t('organizations.fields.primaryAddress')
    : t('organizations.fields.mailingAddress');

  const drawerSubtitle = isPrimaryAddress
    ? t('organizations.drawer.primaryAddressSubtitle')
    : t('organizations.drawer.mailingAddressSubtitle');

  const drawerIcon = isPrimaryAddress ? ICONS.HOME_DUOTONE : ICONS.LETTER_DUOTONE;

  return (
    <DashboardContent>
      <PageHeader
        title={t('organizations.title')}
        description={t('organizations.description')}
        breadcrumbs={[
          { label: t('organizations.breadcrumb.workspace') },
          { label: t('organizations.breadcrumb.organizations') },
        ]}
      />

      <Stack spacing={3} direction="row" sx={{ maxWidth: 'lg', mx: 'auto' }}>
        <Stack spacing={3} sx={{ minWidth: 500, mx: 'auto' }}>
          <CustomCard config={organizationDetailConfig} loading={loading} />
        </Stack>
        <Stack spacing={3} sx={{ minWidth: 350, mx: 'auto' }}>
          <CustomCard config={primaryAddressConfig} loading={loading} />
          <CustomCard config={mailingAddressConfig} loading={loading} />
        </Stack>
      </Stack>

      <FeatureDrawer
        open={!!editingAddress}
        onClose={handleCancelEdit}
        title={drawerTitle}
        subtitle={drawerSubtitle}
        icon={drawerIcon}
        width={500}
        footer={
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={handleCancelEdit}
              startIcon={<Iconify icon={ICONS.CLOSE_CIRCLE} />}
            >
              {t('actions.cancel')}
            </Button>
            <Button
              variant="contained"
              onClick={() => formRef.current?.requestSubmit()}
              startIcon={<Iconify icon={ICONS.CHECK_CIRCLE} />}
            >
              {t('actions.save')}
            </Button>
          </Stack>
        }
      >
        <EnhancedFormBuilder
          formRef={formRef}
          rows={getAddressFieldRows(t, isPrimaryAddress)}
          store={organizationAddressStore}
          mode="update"
          entityId={organizationId}
          defaultValues={trimmedAccount}
          columns={2}
          hideSubmitButton
          onSuccess={handleSuccess}
        />
      </FeatureDrawer>
    </DashboardContent>
  );
}
