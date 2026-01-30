import { useRouter } from '@asyml8/ui';
import { useBoolean } from 'minimal-shared/hooks';
import { ICONS, Iconify, BrandLogo, SignUpForm, type SignUpSchemaType } from '@asyml8/ui';

import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/hooks/use-auth-context';

import { useTranslate } from 'src/locales';
import { AuthLayout } from 'src/layouts/auth-layout';

export default function SupabaseSignUpPage() {
  const router = useRouter();
  const { t } = useTranslate('common');
  const { register } = useAuthContext();
  const showPassword = useBoolean();

  const handleSubmit = async (data: SignUpSchemaType) => {
    await register?.(data.email, data.password, data.firstName, data.lastName);
    router.push(paths.auth.emailVerification);
  };

  const handleSignIn = () => {
    router.push(paths.auth.signIn);
  };

  return (
    <AuthLayout variant="centered" formMaxWidth="450px" headerBgOpacity={0.1}>
      <SignUpForm
        logo={<BrandLogo />}
        title={t('auth.signUp.title')}
        description={
          <>
            {t('auth.signUp.description')} {t('auth.signUp.signInText')}{' '}
            <Link
              component="button"
              type="button"
              onClick={handleSignIn}
              variant="subtitle2"
              sx={{ textDecoration: 'none' }}
            >
              Sign in
            </Link>
          </>
        }
        submitText={t('auth.signUp.submit')}
        loadingText={t('auth.signUp.loading')}
        onSubmit={handleSubmit}
        showPassword={showPassword.value}
        onTogglePassword={showPassword.onToggle}
        passwordVisibleIcon={<Iconify icon={ICONS.EYE} />}
        passwordHiddenIcon={<Iconify icon={ICONS.EYE_CLOSED} />}
      />
    </AuthLayout>
  );
}
