import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, InitializeView } from '@asyml8/ui';

import { uiLogger } from 'src/utils/logger.util';

import { AppLogo } from 'src/components';
import { useTranslate } from 'src/locales';
import { useAppStore } from 'src/store/app.store';
import { AnimatedLayout } from 'src/layouts/animated-layout';
import { getPublicServiceConfigs } from 'src/services/public-startup.services';

export default function PublicStartupPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslate('common');
  const setPublicStartupComplete = useAppStore((state) => state.setPublicStartupComplete);
  const targetRedirectPath = useAppStore((state) => state.targetRedirectPath);
  const setTargetRedirectPath = useAppStore((state) => state.setTargetRedirectPath);

  const services = useMemo(() => getPublicServiceConfigs(queryClient), [queryClient]);

  return (
    <AnimatedLayout headerBgOpacity={0.1}>
      <InitializeView
        services={services}
        redirectDelay={1500}
        errorDisplay="summary"
        onPreInitialize={() => {
          uiLogger.info('Public startup: Pre-initialization check');
          return true;
        }}
        onValidate={(results) => {
          const accountsData = results.find((r) => r.service === 'accounts')?.data;
          if (!accountsData || !Array.isArray(accountsData) || accountsData.length === 0) {
            uiLogger.warn('Public startup: No accounts data found');
            return false;
          }

          uiLogger.info('Public startup: Validation passed');
          return true;
        }}
        onSuccess={() => {
          setPublicStartupComplete(true);
          const redirectTo = targetRedirectPath || '/';
          setTargetRedirectPath(null); // Clear after using
          router.push(redirectTo);
        }}
        onError={(errors) => {
          uiLogger.error('Public startup failed:', errors);
          setPublicStartupComplete(false);
        }}
        logo={<AppLogo width={64} height={64} />}
        buttonSx={{ px: 4, py: 1.5, borderRadius: '12px' }}
        containerSx={{ bgcolor: 'transparent' }}
        onLogout={undefined}
        systemUnavailableText={t('error.serverError.title')}
      />
    </AnimatedLayout>
  );
}
