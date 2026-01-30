import { useState, useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { useRouter, useSearchParams } from '@asyml8/ui';
import {
  ICONS,
  Iconify,
  BrandLogo,
  UpdatePasswordForm,
  useNotificationStore,
  type UpdatePasswordSchemaType,
} from '@asyml8/ui';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/hooks/use-auth-context';

import { uiLogger } from 'src/utils/logger.util';

import { useTranslate } from 'src/locales';
import { supabase } from 'src/lib/supabase';
import { AuthLayout } from 'src/layouts/auth-layout';

export default function SupabaseUpdatePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslate('common');
  const { updatePassword } = useAuthContext();
  const { addNotification } = useNotificationStore();
  const showPassword = useBoolean();
  const [initializing, setInitializing] = useState(true);
  const [flowType, setFlowType] = useState<'invite' | 'recovery'>('recovery');

  // When arriving from the email link, Supabase sends tokens in the URL hash.
  useEffect(() => {
    const processHashSession = async () => {
      if (typeof window === 'undefined') return;

      const hash = window.location.hash.slice(1);
      if (!hash) {
        setInitializing(false);
        return;
      }

      const params = new URLSearchParams(hash);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const type = params.get('type');

      // Detect flow type
      if (type === 'invite') {
        setFlowType('invite');
      }

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
        if (error) {
          uiLogger.error('Failed to set Supabase session from invite link', error);
          addNotification({
            type: 'error',
            message: 'Invalid or expired link. Please request a new invitation.',
            duration: 5000,
          });
        }
      }
      setInitializing(false);
    };

    void processHashSession();
  }, [addNotification, router]);

  const handleSubmit = async (data: UpdatePasswordSchemaType) => {
    try {
      uiLogger.debug('Page handleSubmit called', { flowType, data });
      if (!updatePassword) {
        uiLogger.error('updatePassword function not available');
        throw new Error('Update password function not available');
      }
      uiLogger.debug('Calling updatePassword from auth provider');
      await updatePassword(data.password);
      uiLogger.info('Password updated successfully');

      addNotification({
        type: 'success',
        message: t('auth.updatePassword.success'),
        duration: 3000,
      });

      router.push(paths.dashboard.root);
    } catch (error) {
      uiLogger.error('Failed to update password:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
      addNotification({
        type: 'error',
        message: errorMessage,
        duration: 5000,
      });
      throw error;
    }
  };

  return (
    <AuthLayout variant="centered" headerBgOpacity={0.1}>
      <div style={{ width: '350px', maxWidth: '100%' }}>
        <UpdatePasswordForm
          logo={<BrandLogo isSingle={false} />}
          title={t('auth.updatePassword.title')}
          description={
            flowType === 'invite'
              ? t('auth.updatePassword.descriptionInvite')
              : t('auth.updatePassword.description')
          }
          onSubmit={handleSubmit}
          submitText={
            initializing ? t('auth.updatePassword.preparing') : t('auth.updatePassword.submit')
          }
          loadingText={t('auth.updatePassword.loading')}
          showPassword={showPassword.value}
          onTogglePassword={showPassword.onToggle}
          passwordVisibleIcon={<Iconify icon={ICONS.EYE} />}
          passwordHiddenIcon={<Iconify icon={ICONS.EYE_CLOSED} />}
          emailLabel={t('auth.updatePassword.emailLabel')}
          emailPlaceholder={t('auth.updatePassword.emailPlaceholder')}
          passwordLabel={t('auth.updatePassword.passwordLabel')}
          passwordPlaceholder={t('auth.updatePassword.passwordPlaceholder')}
          passwordHelperText={t('auth.updatePassword.passwordHelperText')}
          confirmPasswordLabel={t('auth.updatePassword.confirmPasswordLabel')}
          confirmPasswordPlaceholder={t('auth.updatePassword.confirmPasswordPlaceholder')}
          confirmPasswordHelperText={t('auth.updatePassword.confirmPasswordHelperText')}
        />
      </div>
    </AuthLayout>
  );
}
