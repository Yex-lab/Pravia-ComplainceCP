import { ICONS, Iconify, FeatureCard, CtaLiquidButton } from '@asyml8/ui';

import { AppLogo } from 'src/components';
import { useTranslate } from 'src/locales/use-locales';

const FEATURE_ICONS = [
  { key: 'secureDocuments', icon: 'solar:lock-keyhole-bold', iconColor: '#3B6D99' },
  { key: 'aiWorkflows', icon: 'solar:settings-bold', iconColor: '#6B8E4E' },
  { key: 'teamCollaboration', icon: 'solar:users-group-rounded-bold', iconColor: '#6B5B95' },
  { key: 'realTimeTracking', icon: 'solar:clock-circle-bold', iconColor: '#D97B3A' },
];

export function LandingFeatures() {
  const { t } = useTranslate('common');

  const items = FEATURE_ICONS.map((feature) => ({
    icon: feature.icon,
    iconBgColor: feature.iconColor,
    title: t(`landing.platformBenefits.features.${feature.key}.title`),
    description: t(`landing.platformBenefits.features.${feature.key}.description`),
  }));

  return (
    <FeatureCard
      headerIcon={<AppLogo width={52} height={52} color="currentColor" />}
      title={t('landing.platformBenefits.title')}
      subtitle={t('landing.platformBenefits.subtitle')}
      items={items}
      animated
      button={
        <CtaLiquidButton
          fullWidth
          startIcon={<Iconify icon={ICONS.DOCUMENT_TEXT_DUOTONE} />}
          sx={{ py: 1.5, borderRadius: '12px' }}
        >
          {t('landing.platformBenefits.startSubmission')}
        </CtaLiquidButton>
      }
      sx={{ maxWidth: 450 }}
    />
  );
}
