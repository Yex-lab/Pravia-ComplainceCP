import { useRouter, useSearchParams } from '@asyml8/ui';
import { BrandLogo, VerifyEmailForm, type VerifyEmailSchemaType } from '@asyml8/ui';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { supabase } from 'src/lib/supabase';
import { AuthLayout } from 'src/layouts/auth-layout';

export default function SupabaseVerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslate('common');
  const email = searchParams.get('email') || '';

  const handleSubmit = async (data: VerifyEmailSchemaType) => {
    const { error } = await supabase.auth.verifyOtp({
      email: data.email,
      token: data.code,
      type: 'email',
    });

    if (error) throw error;
    router.push(paths.dashboard.root);
  };

  const handleResendCode = async (emailAddress: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: emailAddress,
    });

    if (error) throw error;
  };

  const handleBackToSignIn = () => {
    router.push(paths.auth.signIn);
  };

  return (
    <AuthLayout variant="centered" formMaxWidth="450px" headerBgOpacity={0.1}>
      <VerifyEmailForm
        logo={<BrandLogo />}
        title={t('auth.verifyOtp.title')}
        description={t('auth.verifyOtp.description')}
        email={email}
        submitText={t('auth.verifyOtp.submit')}
        loadingText={t('auth.verifyOtp.loading')}
        resendText={t('auth.verifyOtp.resend')}
        backLinkText={t('auth.verifyOtp.backLink')}
        onSubmit={handleSubmit}
        onResendCode={handleResendCode}
        onBackToSignIn={handleBackToSignIn}
      />
    </AuthLayout>
  );
}
