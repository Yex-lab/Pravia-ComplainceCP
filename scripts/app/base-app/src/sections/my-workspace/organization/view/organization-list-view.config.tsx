import type { TFunction } from 'i18next';
import type { FluxTypes } from '@asyml8/api-types';
import type { FormFieldRow, CustomCardConfig } from '@asyml8/ui';

import { ICONS, US_STATES, CA_COUNTIES } from '@asyml8/ui';

export const getAddressFieldRows = (t: TFunction, isPrimaryAddress: boolean): FormFieldRow[] => [
  {
    fields: [
      {
        id: 'streetLine1',
        name: isPrimaryAddress ? 'addressLine1' : 'mailingAddressLine1',
        label: t('organizations.fields.streetLine1'),
        type: 'text',
      },
    ],
  },
  {
    fields: [
      {
        id: 'streetLine2',
        name: isPrimaryAddress ? 'addressLine2' : 'mailingAddressLine2',
        label: t('organizations.fields.streetLine2'),
        type: 'text',
      },
    ],
  },
  {
    fields: [
      {
        id: 'city',
        name: isPrimaryAddress ? 'city' : 'mailingCity',
        label: t('organizations.fields.city'),
        type: 'text',
      },
      {
        id: 'state',
        name: isPrimaryAddress ? 'state' : 'mailingState',
        label: t('organizations.fields.stateProvince'),
        type: 'select',
        options: US_STATES.map((state) => ({
          label: state.name,
          value: state.code,
        })),
      },
    ],
  },
  {
    fields: [
      {
        id: 'postalCode',
        name: isPrimaryAddress ? 'postalCode' : 'mailingPostalCode',
        label: t('organizations.fields.postalCode'),
        type: 'zipcode',
      },
      {
        id: 'county',
        name: isPrimaryAddress ? 'county' : 'mailingCounty',
        label: t('organizations.fields.county'),
        type: 'autocomplete',
        freeSolo: true,
        options: CA_COUNTIES.map((county) => ({
          label: county,
          value: county,
          icon: 'CA',
          color: 'primary' as const,
        })),
      },
    ],
  },
];

export const getOrganizationDetailConfig = (
  t: TFunction,
  account: FluxTypes.AccountDto | undefined,
  parentAccountName: string | undefined,
  primaryContactName: string | undefined
): CustomCardConfig => ({
  title: t('organizations.information'),
  icon: ICONS.BUILDINGS_DUOTONE,
  data: [
    { label: t('organizations.fields.organizationName'), value: account?.name, fullWidth: true },
    { type: 'divider', dividerStyle: 'dashed' as const },
    { label: t('organizations.fields.acronym'), value: account?.acronym },
    {
      label: t('organizations.fields.complianceDueDate'),
      value: account?.complianceDueDate
        ? (() => {
            const date = account.complianceDueDate.split('T')[0]; // Get YYYY-MM-DD
            const [year, month, day] = date.split('-');
            return `${month}/${day}/${year}`;
          })()
        : undefined,
      icon: ICONS.FLAG,
    },
    {
      label: t('organizations.fields.parentOrganization'),
      value: parentAccountName || account?.parentAccountId,
    },
    {
      label: t('organizations.fields.orgCode'),
      value: account?.orgCode,
      type: 'label',
      labelConfig: { color: 'secondary', variant: 'filled' },
      labelConfigIfNull: { color: 'default', variant: 'soft' },
      valueIfNull: 'N/A',
      icon: ICONS.TAG_HORIZONTAL,
    },
    {
      label: t('organizations.fields.primaryContact'),
      value: primaryContactName || account?.primaryContactId,
    },
    {
      label: t('organizations.fields.govCode'),
      value: account?.govCode,
      type: 'label',
      labelConfig: { color: 'secondary', variant: 'filled' },
      labelConfigIfNull: { color: 'default', variant: 'soft' },
      valueIfNull: 'N/A',
      icon: ICONS.SHIELD_CHECK,
    },
    {
      label: t('organizations.fields.socEmailAddress'),
      value: account?.socEmailAddress,
    },
  ],
});

export const getPrimaryAddressConfig = (
  t: TFunction,
  account: FluxTypes.AccountDto | undefined,
  handleEditAddress?: (type: 'primary' | 'mailing') => void
): CustomCardConfig => ({
  title: t('organizations.fields.primaryAddress'),
  icon: ICONS.HOME_DUOTONE,
  actionConfig: handleEditAddress
    ? {
        type: 'button',
        icon: ICONS.PEN,
        onClick: () => handleEditAddress('primary'),
      }
    : undefined,
  data: [
    { label: t('organizations.fields.streetLine1'), value: account?.addressLine1, fullWidth: true },
    { label: t('organizations.fields.streetLine2'), value: account?.addressLine2, fullWidth: true },
    { label: t('organizations.fields.city'), value: account?.city },
    { label: t('organizations.fields.postalCode'), value: account?.postalCode },
    { label: t('organizations.fields.stateProvince'), value: account?.state },
    { label: t('organizations.fields.county'), value: account?.county },
  ],
});

export const getMailingAddressConfig = (
  t: TFunction,
  account: FluxTypes.AccountDto | undefined,
  handleEditAddress?: (type: 'primary' | 'mailing') => void
): CustomCardConfig => ({
  title: t('organizations.fields.mailingAddress'),
  icon: ICONS.LETTER_DUOTONE,
  actionConfig: handleEditAddress
    ? {
        type: 'button',
        icon: ICONS.PEN,
        onClick: () => handleEditAddress('mailing'),
      }
    : undefined,
  data: [
    {
      label: t('organizations.fields.streetLine1'),
      value: account?.mailingAddressLine1,
      fullWidth: true,
    },
    {
      label: t('organizations.fields.streetLine2'),
      value: account?.mailingAddressLine2,
      fullWidth: true,
    },
    { label: t('organizations.fields.city'), value: account?.mailingCity },
    { label: t('organizations.fields.postalCode'), value: account?.mailingPostalCode },
    { label: t('organizations.fields.stateProvince'), value: account?.mailingState },
    { label: t('organizations.fields.county'), value: account?.mailingCounty },
  ],
});
