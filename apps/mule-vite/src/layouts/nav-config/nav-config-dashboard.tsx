import type { NavSectionProps } from '@asyml8/ui';

import { ICONS, Iconify } from '@asyml8/ui';
import { useTranslation } from 'react-i18next';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const NAV_ICONS = {
  dashboard: <Iconify icon={ICONS.WIDGET_5} />,
  user: <Iconify icon={ICONS.USER_ROUNDED_DUOTONE} />,
  file: <Iconify icon={ICONS.DOCUMENT} />,
  tour: <Iconify icon={ICONS.MAP_POINT_WAVE} />,
  label: <Iconify icon={ICONS.TAG} />,
  banking: <Iconify icon={ICONS.WALLET_2} />,
  lock: <Iconify icon={ICONS.LOCK} />,
  settings: <Iconify icon={ICONS.SETTINGS_DUOTONE} />,
  shield: <Iconify icon={ICONS.SHIELD} />,
  users: <Iconify icon={ICONS.USERS_GROUP_DUOTONE} />,
  clipboard: <Iconify icon={ICONS.BILL_LIST_DUOTONE} />,
};

// ----------------------------------------------------------------------

export function useNavData(): NavSectionProps['data'] {
  const { t } = useTranslation();

  return [
    {
      subheader: t('nav.dashboards'),
      items: [
        {
          title: t('nav.overview'),
          path: paths.dashboard.compliance,
          icon: NAV_ICONS.dashboard,
        },
      ],
    },
    {
      subheader: t('nav.workspace'),
      items: [
        {
          title: t('nav.organization'),
          path: paths.myWorkspace.organization,
          icon: NAV_ICONS.banking,
        },
        { title: t('nav.submissions'), path: paths.myWorkspace.submissions, icon: NAV_ICONS.file },
        { title: t('nav.contacts'), path: paths.myWorkspace.contacts, icon: NAV_ICONS.user },
      ],
    },
    {
      subheader: t('nav.resources'),
      items: [{ title: t('nav.faqs'), path: paths.resources.faqs, icon: NAV_ICONS.label }],
    },
    // {
    //   subheader: t('nav.administration'),
    //   items: [
    //     // {
    //     //   title: t('nav.user-management'),
    //     //   path: paths.admin.userManagement.users,
    //     //   icon: NAV_ICONS.users,
    //     //   children: [
    //     //     { title: t('nav.users'), path: paths.admin.userManagement.users },
    //     //     // { title: t('nav.roles'), path: paths.admin.userManagement.roles },
    //     //     // { title: t('nav.groups'), path: paths.admin.userManagement.groups },
    //     //     // { title: t('nav.permissions'), path: paths.admin.userManagement.permissions },
    //     //   ],
    //     // },
    // {
    //   title: t('nav.permissions'),
    //   path: paths.admin.permissions.auditLogs,
    //   icon: NAV_ICONS.shield,
    //   children: [{ title: t('nav.audit-logs'), path: paths.admin.permissions.auditLogs }],
    // },
    // {
    //   title: t('nav.configuration'),
    //   path: paths.admin.configuration.configurations,
    //   icon: NAV_ICONS.settings,
    //   children: [
    //     { title: t('nav.configurations'), path: paths.admin.configuration.configurations },
    //     { title: t('nav.types'), path: paths.admin.configuration.types },
    //     { title: t('nav.config-groups'), path: paths.admin.configuration.groups },
    //     { title: t('nav.templates'), path: paths.admin.configuration.templates },
    //     { title: t('nav.modules'), path: paths.admin.configuration.modules },
    //   ],
    // },
    //   ],
    // },
  ];
}
