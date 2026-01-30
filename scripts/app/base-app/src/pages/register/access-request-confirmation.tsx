import { useRouter, BrandLogo, CheckEmailForm } from '@asyml8/ui';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { AuthLayout } from 'src/layouts/auth-layout';

export default function AccessRequestConfirmationPage() {
  const router = useRouter();
  const { t } = useTranslate('common');

  const handleBackToSignIn = () => {
    router.push(paths.auth.signIn);
  };

  return (
    <AuthLayout variant="centered" formMaxWidth="450px" headerBgOpacity={0.1}>
      <CheckEmailForm
        logo={<BrandLogo />}
        title="Approval Pending"
        description="No action is required at this time. Your request is pending review, and you will be notified once a decision is made."
        helpText="Didn't receive the email? Check your spam folder or try signing up again."
        backButtonText="Continue"
        onBackToSignIn={handleBackToSignIn}
      />
    </AuthLayout>
  );
}
