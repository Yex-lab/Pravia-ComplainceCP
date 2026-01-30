import { useTranslation } from 'react-i18next';

import { ComplianceDashboardView } from '../../sections/dashboard/compliance/view';

export default function CompliancePage() {
  const { t } = useTranslation();

  return (
    <>
      <title>{t('nav.overview') || 'Compliance'}</title>
      <ComplianceDashboardView />
    </>
  );
}
