import { useRouter } from '@asyml8/ui';
import { useBoolean } from 'minimal-shared/hooks';
import {
  ICONS,
  Iconify,
  BrandLogo,
  SignInForm,
  FeatureCard,
  type SignInSchemaType,
} from '@asyml8/ui';

import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/hooks/use-auth-context';

import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/global-config';
import { AuthLayout } from 'src/layouts/auth-layout';

// ----------------------------------------------------------------------

export default function SupabaseSignInPage() {
  const router = useRouter();
  const { t } = useTranslate('common');
  const showPassword = useBoolean();
  const { login } = useAuthContext();

  const complianceFeatures = t('auth.signIn.features', { returnObjects: true }) as Array<{
    icon: string;
    iconBgColor: string;
    title: string;
    description: string;
  }>;

  const HeroContent = () => (
    <FeatureCard
      headerIcon={<Iconify icon={ICONS.USER_ROUNDED_DUOTONE} width={52} />}
      title={t('auth.signIn.heroTitle')}
      subtitle={t('auth.signIn.heroSubtitle')}
      items={complianceFeatures}
      animated
      sx={{ maxWidth: 450 }}
    />
  );

  const handleSubmit = async (data: SignInSchemaType) => {
    await login?.(data.email, data.password);
    router.push(CONFIG.auth.redirectPath);
  };

  const handleSignUp = () => {
    router.push(paths.register.requestOrganizationAccess);
  };

  const handleForgotPassword = () => {
    router.push(paths.auth.forgotPassword);
  };

  return (
    <AuthLayout
      variant="split"
      sideContent={<HeroContent />}
      headerBgOpacity={0.1}
      formMaxWidth="400px"
    >
      <SignInForm
        logo={<BrandLogo />}
        title={t('auth.signIn.title')}
        description={
          <>
            {t('auth.signIn.description')}
            {'. '}
            {`Don't have an account? `}
            <Link
              component="button"
              type="button"
              onClick={handleSignUp}
              variant="subtitle2"
              sx={{ textDecoration: 'none' }}
            >
              {t('auth.signIn.signUpText')}
            </Link>
          </>
        }
        submitText={t('auth.signIn.submit')}
        loadingText={t('auth.signIn.loading')}
        forgotPasswordText={t('auth.signIn.forgotPasswordText')}
        onSubmit={handleSubmit}
        onForgotPassword={handleForgotPassword}
        showPassword={showPassword.value}
        onTogglePassword={showPassword.onToggle}
        passwordVisibleIcon={<Iconify icon={ICONS.EYE} />}
        passwordHiddenIcon={<Iconify icon={ICONS.EYE_CLOSED} />}
      />
    </AuthLayout>
  );
}
