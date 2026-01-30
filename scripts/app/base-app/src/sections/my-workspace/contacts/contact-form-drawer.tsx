import type { FluxTypes } from '@asyml8/api-types';

import { useRef, useMemo } from 'react';
import {
  ICONS,
  Iconify,
  formatPhone,
  FeatureDrawer,
  EnhancedFormBuilder,
  formatBusinessPhone,
} from '@asyml8/ui';

type Contact = FluxTypes.ContactResponseDto;

import { Stack, Button } from '@mui/material';

import { useTranslation } from 'src/hooks/use-translation';
import { usePermissions } from 'src/hooks/use-permissions';
import { useAuthContext } from 'src/hooks/use-auth-context';

import { contactFormStore } from 'src/store/forms/contact.form';
import { useAppStore, useRolesData, useContactStatusData } from 'src/store/app.store';

interface ContactFormDialogProps {
  open: boolean;
  onClose: () => void;
  contact?: Contact | null;
  accountId: string;
  primaryContactId?: string | null;
}

export function ContactFormDialog({
  open,
  onClose,
  contact,
  accountId,
  primaryContactId,
}: ContactFormDialogProps) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const { user } = useAuthContext();
  const formRef = useRef<HTMLFormElement>(null);
  const roles = useRolesData();
  const organizationRoles = useAppStore((state) => state.slices.organizationRoles.data);
  const contactId = contact?.id;
  const mode = contactId ? 'update' : 'create';

  const contactStatus = useContactStatusData(contact?.email || '');
  const isRegistered = contactStatus?.status === 'confirmed';
  const isOwnContact = contact?.email?.toLowerCase() === user?.email?.toLowerCase();
  const canEditRoles = hasPermission('edit_contacts') && !isOwnContact;

  console.log('Contact form - isOwnContact:', isOwnContact);
  console.log('Contact form - canEditRoles:', canEditRoles);
  console.log('Contact form - isRegistered:', isRegistered);

  const isEditingPrimaryContact = Boolean(contact?.id && contact.id === primaryContactId);
  const defaultValues = useMemo(() => {
    if (!contact) return undefined;

    // Combine phone and extension into businessPhone format
    let businessPhone = '';
    if (contact.phone) {
      const phoneOnly = contact.phone.replace(/\D/g, '').slice(-10);
      businessPhone = formatBusinessPhone(phoneOnly + (contact.businessPhoneExtension || ''));
    }

    // Format mobile phone (no extension)
    let mobilePhone = '';
    if (contact.mobilePhone) {
      const phoneOnly = contact.mobilePhone.replace(/\D/g, '').slice(-10);
      mobilePhone = formatPhone(phoneOnly);
    }

    // Filter organizationRoles by contactId to get assigned role IDs
    const roleIds = organizationRoles
      .filter((r: any) => r.contactId === contact.id)
      .map((r: any) => r.roleId);

    return {
      ...contact,
      businessPhone,
      mobilePhone,
      isPrimaryContact: Boolean(primaryContactId && contact.id === primaryContactId),
      roles: roleIds,
      authorizedDocumentTypes: null,
      organizationId: (user as any)?.user_metadata?.organization_id, // Add organizationId from token
    };
  }, [contact, user, organizationRoles, primaryContactId]);

  const title = useMemo(
    () => (mode === 'create' ? t('contacts.form.addTitle') : t('contacts.form.editTitle')),
    [mode, t]
  );

  const subtitle = useMemo(
    () => (mode === 'create' ? t('contacts.form.addSubtitle') : t('contacts.form.editSubtitle')),
    [mode, t]
  );

  const contactFormRows = useMemo(
    () => [
      {
        fields: [
          {
            id: 'firstName',
            name: 'firstName',
            label: t('contacts.form.firstName'),
            type: 'text' as const,
            required: true,
            placeholder: t('contacts.form.placeholders.firstName'),
          },
          {
            id: 'lastName',
            name: 'lastName',
            label: t('contacts.form.lastName'),
            type: 'text' as const,
            required: true,
            placeholder: t('contacts.form.placeholders.lastName'),
          },
        ],
      },
      {
        fields: [
          {
            id: 'email',
            name: 'email',
            label: t('contacts.form.email'),
            type: 'email' as const,
            required: true,
            placeholder: t('contacts.form.placeholders.email'),
            disabled: mode === 'update',
          },
        ],
      },
      {
        fields: [
          {
            id: 'jobTitle',
            name: 'jobTitle',
            label: t('contacts.form.jobTitle'),
            type: 'text' as const,
            placeholder: t('contacts.form.placeholders.jobTitle'),
          },
        ],
      },
      {
        fields: [
          {
            id: 'businessPhone',
            name: 'businessPhone',
            label: t('contacts.form.businessPhone'),
            type: 'businessPhone' as const,
            placeholder: t('contacts.form.placeholders.businessPhone'),
          },
          {
            id: 'mobilePhone',
            name: 'mobilePhone',
            label: t('contacts.form.mobilePhone'),
            type: 'phone' as const,
            placeholder: t('contacts.form.placeholders.mobilePhone'),
          },
        ],
      },
      // Only show divider and roles when editing (not adding)
      ...(mode === 'update'
        ? [
            {
              fields: [
                {
                  id: 'phone-divider',
                  name: 'phone-divider',
                  label: '',
                  type: 'divider' as const,
                },
              ],
            },
            ...(canEditRoles
              ? [
                  {
                    fields: [
                      {
                        id: 'roles',
                        name: 'roles',
                        label: t('contacts.form.roles'),
                        type: 'multiselect' as const,
                        required: isRegistered,
                        options: roles.map((role: any) => ({
                          value: role.id,
                          label: role.name,
                          icon: ICONS.SHIELD_CHECK,
                          iconColor: 'primary.main',
                        })),
                        placeholder: t('contacts.form.placeholders.roles'),
                        labelIcon: ICONS.SHIELD_CHECK,
                        labelIconColor: 'text.secondary',
                        disabled: !isRegistered,
                      },
                    ],
                  },
                ]
              : []),
          ]
        : []),
    ],
    [t, mode, roles, canEditRoles, isRegistered]
  );

  const handleSuccess = async () => {
    onClose();
  };

  return (
    <FeatureDrawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={ICONS.USER_ID_DUOTONE as any}
      iconSize={48}
      iconColor={
        isEditingPrimaryContact ? 'success.main' : isOwnContact ? 'secondary.main' : 'primary.main'
      }
      titleChip={
        isEditingPrimaryContact
          ? {
              label: t('contacts.filters.primary'),
            }
          : undefined
      }
      width={480}
      footer={
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={onClose}
            startIcon={<Iconify icon={ICONS.CLOSE_CIRCLE} />}
          >
            {t('contacts.form.cancel')}
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
        rows={contactFormRows as any}
        store={contactFormStore}
        mode={mode}
        defaultValues={
          defaultValues || { organizationId: (user as any)?.user_metadata?.organization_id }
        }
        hideSubmitButton
        onSuccess={handleSuccess}
      />
    </FeatureDrawer>
  );
}
