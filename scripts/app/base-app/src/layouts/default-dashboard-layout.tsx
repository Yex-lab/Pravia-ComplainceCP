import type { DashboardLayoutProps } from '@asyml8/ui';

import { useNavigate } from 'react-router';
import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';
import {
  useRouter,
  BrandLogo,
  Searchbar,
  RouterLink,
  usePathname,
  ThemeCreator,
  AccountOverlay,
  SettingsButton,
  DashboardLayout,
  setCustomColors,
  useSettingsContext,
  setCustomSecondaryColors,
} from '@asyml8/ui';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { useTranslation } from 'src/hooks/use-translation';

import { uiLogger } from 'src/utils/logger.util';

import { useAuthContext } from 'src/hooks';

import { SubmissionProcessingWidget } from 'src/components/submission-processing-widget';

import { useNavData } from './nav-config';
import { Footer } from './components/footer';
import { APP_ENV, APP_VERSION } from '../config-version';
import { LanguagePopover } from './components/language-popover';
import { TestCleanupDrawer } from '../sections/admin/test-cleanup';

// ----------------------------------------------------------------------

export type DefaultDashboardLayoutProps = Pick<
  DashboardLayoutProps,
  'children' | 'sx' | 'cssVars' | 'layoutQuery' | 'slotProps' | 'infoCard'
>;

export function DefaultDashboardLayout({
  children,
  layoutQuery = 'lg',
  infoCard,
  ...other
}: DefaultDashboardLayoutProps) {
  const theme = useTheme();
  const router = useRouter();
  const navigate = useNavigate();
  const pathname = usePathname();
  const { user, logout } = useAuthContext();
  const settings = useSettingsContext();
  const navData = useNavData();
  const { t } = useTranslation();

  const { value: navOpen, onFalse: onNavClose, onTrue: onNavOpen } = useBoolean();
  const [cleanupDrawerOpen, setCleanupDrawerOpen] = useState(false);

  const firstName = (user as any)?.user_metadata?.first_name ?? (user as any)?.firstName;
  const lastName = (user as any)?.user_metadata?.last_name ?? (user as any)?.lastName;
  const displayName = (user as any)?.displayName ?? user?.email?.split('@')[0] ?? 'User';
  const email = user?.email;

  const enableTools =
    import.meta.env.VITE_ENABLE_TOOLS === 'true' ||
    import.meta.env.VITE_ENABLE_TOOLS === true ||
    import.meta.env.VITE_ENABLE_TOOLS === '1' ||
    import.meta.env.VITE_APP_ENV === 'Dev' ||
    import.meta.env.VITE_APP_ENV === 'development' ||
    import.meta.env.MODE === 'development';

  // Contact data is loaded at startup, no need to fetch here

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!email) {
      uiLogger.info('Dataverse contact lookup skipped: no user email found');
      return;
    }

    // Contact data is already loaded at startup via auth-startup.services.ts
  }, [email]);

  const handleEditProfile = () => {
    if (user?.id) {
      navigate(paths.admin.userManagement.user(user.id));
    }
  };

  const handleSignOut = useCallback(async () => {
    try {
      await logout?.();
      router.push(paths.auth.signIn);
    } catch (error) {
      console.error(error);
    }
  }, [logout, router]);

  const accountMenuItems = [
    { label: 'Profile', icon: 'solar:user-outline', onClick: handleEditProfile },
    // { label: 'Settings', icon: 'solar:settings-outline', onClick: () => {} },
    // { label: 'Notifications', icon: 'solar:bell-outline', onClick: () => {} },
    ...(enableTools
      ? [
          {
            label: t('tools.menuItem'),
            icon: 'solar:code-bold',
            onClick: () => setCleanupDrawerOpen(true),
            color: 'error.main',
          },
        ]
      : []),
  ];

  const canDisplayItemByRole = (allowedRoles?: string | string[]): boolean => {
    if (!allowedRoles) return true;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return !roles.includes(user?.role);
  };

  const handleNavToggle = () => {
    settings.setField('navLayout', settings.state.navLayout === 'vertical' ? 'mini' : 'vertical');
  };

  const handleThemeApply = (colors: any) => {
    // Set the custom colors for both primary and secondary
    if (colors?.primary) {
      setCustomColors({
        lighter: colors.primary.lighter,
        light: colors.primary.light,
        main: colors.primary.main,
        dark: colors.primary.dark,
        darker: colors.primary.darker,
      });
    }
    if (colors?.secondary) {
      setCustomSecondaryColors({
        lighter: colors.secondary.lighter,
        light: colors.secondary.light,
        main: colors.secondary.main,
        dark: colors.secondary.dark,
        darker: colors.secondary.darker,
      });
    }
    // Switch to custom preset
    settings.setField('primaryColor', 'custom');
  };

  return (
    <>
      <DashboardLayout
        navData={navData}
        pathname={pathname}
        navOpen={navOpen}
        onNavOpen={onNavOpen}
        onNavClose={onNavClose}
        onNavToggle={handleNavToggle}
        navLayout={settings.state.navLayout}
        navColor={settings.state.navColor}
        infoCard={infoCard}
        checkPermissions={canDisplayItemByRole}
        layoutQuery={layoutQuery}
        slotProps={{
          RouterLink,
        }}
        slots={{
          nav: {
            topArea: (
              <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
                <BrandLogo
                  title={t('dashboard.title')}
                  subtitle={t('dashboard.subtitle')}
                  LinkComponent={RouterLink}
                  isSingle={false}
                  href={paths.dashboard.root}
                />
              </Box>
            ),
          },
          header: {
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                {settings.state.navLayout === 'horizontal' && (
                  <>
                    <BrandLogo
                      title={t('dashboard.title')}
                      subtitle={t('dashboard.subtitle')}
                      LinkComponent={RouterLink}
                      isSingle={false}
                      href={paths.dashboard.root}
                      sx={{
                        display: 'none',
                        [theme.breakpoints.up(layoutQuery)]: { display: 'inline-flex' },
                      }}
                    />
                    <Box
                      sx={{
                        width: 1,
                        height: 10,
                        bgcolor: 'divider',
                        display: { xs: 'none', [layoutQuery]: 'block' },
                      }}
                    />
                  </>
                )}
              </>
            ),
            rightArea: (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
                <Searchbar data={navData} onNavigate={(path) => router.push(path)} />
                <LanguagePopover
                  data={[
                    { value: 'en', label: 'English', countryCode: 'US' },
                    { value: 'es', label: 'Español', countryCode: 'ES' },
                  ]}
                />
                {/* <NotificationsDrawer data={_notifications} /> */}
                <ThemeCreator onApply={handleThemeApply} />
                <SettingsButton />
                <AccountOverlay
                  user={{
                    photoURL: user?.photoURL,
                    firstName,
                    lastName,
                    displayName,
                    email,
                  }}
                  menuItems={accountMenuItems}
                  onSignOut={handleSignOut}
                  version={APP_VERSION}
                  environment={APP_ENV}
                />
              </Box>
            ),
          },
        }}
        {...other}
      >
        {children}
        <Footer />
        <TestCleanupDrawer open={cleanupDrawerOpen} onClose={() => setCleanupDrawerOpen(false)} />
      </DashboardLayout>
      <SubmissionProcessingWidget />
    </>
  );
}
