import { useRouter } from '@asyml8/ui';
import { BrandLogo, ResetPasswordForm, type ResetPasswordSchemaType } from '@asyml8/ui';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/hooks/use-auth-context';

import { useTranslate } from 'src/locales';
import { AuthLayout } from 'src/layouts/auth-layout';

export default function SupabaseForgotPasswordPage() {
  const router = useRouter();
  const { t } = useTranslate('common');
  const { forgotPassword } = useAuthContext();

  const handleSubmit = async (data: ResetPasswordSchemaType) => {
    await forgotPassword?.(data.email);
    router.push(paths.auth.emailVerification);
  };

  const handleBackToSignIn = () => {
    router.push(paths.auth.signIn);
  };

  return (
    <AuthLayout variant="centered" formMaxWidth="450px" headerBgOpacity={0.1}>
      <ResetPasswordForm
        logo={<BrandLogo />}
        title={t('auth.forgotPassword.title')}
        description={t('auth.forgotPassword.description')}
        submitText={t('auth.forgotPassword.submit')}
        loadingText={t('auth.forgotPassword.loading')}
        onSubmit={handleSubmit}
        onBackToSignIn={handleBackToSignIn}
      />
    </AuthLayout>
  );
}
