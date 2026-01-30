import { useParams } from 'react-router';
import { ICONS, useRouter, ErrorView } from '@asyml8/ui';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { AnimatedLayout } from 'src/layouts/animated-layout';

import { AppLogo } from 'src/components/app-logo';

// ----------------------------------------------------------------------

const ERROR_CONFIG: Record<string, { titleKey: string; descriptionKey: string }> = {
  '400': {
    titleKey: 'error.badRequest.title',
    descriptionKey: 'error.badRequest.description',
  },
  '403': {
    titleKey: 'error.forbidden.title',
    descriptionKey: 'error.forbidden.description',
  },
  '404': {
    titleKey: 'error.notFound.title',
    descriptionKey: 'error.notFound.description',
  },
  '500': {
    titleKey: 'error.serverError.title',
    descriptionKey: 'error.serverError.description',
  },
};

export default function ErrorPage() {
  const { code = '404' } = useParams();
  const { t } = useTranslate('common');
  const router = useRouter();

  const config = ERROR_CONFIG[code] || ERROR_CONFIG['404'];

  return (
    <AnimatedLayout headerBgOpacity={0.1}>
      <ErrorView
        code={Number(code)}
        title={t(config.titleKey)}
        description={t(config.descriptionKey)}
        actionButtonText={t('error.goHome')}
        actionButtonIcon={ICONS.HOME}
        logo={<AppLogo width={120} height={120} />}
        onActionClick={() => router.push(paths.root)}
      />
    </AnimatedLayout>
  );
}
