import { useRouter, BrandLogo, CheckEmailForm } from '@asyml8/ui';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { AuthLayout } from 'src/layouts/auth-layout';

export default function SupabaseEmailVerificationPage() {
  const router = useRouter();
  const { t } = useTranslate('common');

  const handleBackToSignIn = () => {
    router.push(paths.auth.signIn);
  };

  return (
    <AuthLayout variant="centered" formMaxWidth="450px" headerBgOpacity={0.1}>
      <CheckEmailForm
        logo={<BrandLogo />}
        title={t('auth.emailVerification.title')}
        description={t('auth.emailVerification.description')}
        helpText={t('auth.emailVerification.helpText')}
        backButtonText={t('auth.emailVerification.backButtonText')}
        onBackToSignIn={handleBackToSignIn}
      />
    </AuthLayout>
  );
}
