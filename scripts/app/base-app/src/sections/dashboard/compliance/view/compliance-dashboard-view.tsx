import { DashboardContent } from '@asyml8/ui';

import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from 'src/hooks/use-translation';

import { useAuthContext } from 'src/hooks';
import { useAppStore, useAccountsData } from 'src/store/app.store';

import { ComplianceBanner } from '../compliance-banner';

export function ComplianceDashboardView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user: loggedInUser } = useAuthContext();

  const accountsData = useAccountsData();
  const isAuthenticatedStartupComplete = useAppStore(
    (state) => state.isAuthenticatedStartupComplete
  );
  const isLoading = !isAuthenticatedStartupComplete;

  const organization = accountsData?.[0];
  const organizationName = organization?.name || 'Organization';
  const loggedInUserName =
    loggedInUser?.displayName ?? loggedInUser?.email?.split('@')[0] ?? 'User';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greeting.morning');
    if (hour < 18) return t('greeting.afternoon');
    return t('greeting.evening');
  };

  return (
    <DashboardContent maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {getGreeting()}, {loggedInUserName}{' '}
          <span style={{ color: theme.palette.primary.main }}>👋</span>
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Last login: {new Date(loggedInUser?.lastSignInAt || Date.now()).toLocaleString()}
        </Typography>
      </Box>

      <ComplianceBanner
        organizationName={organizationName}
        description={t('compliance.description')}
        dueDateLabel={t('compliance.dueDate')}
        dueDate={
          organization?.complianceDueDate
            ? (() => {
                const date = organization.complianceDueDate.split('T')[0];
                const [year, month, day] = date.split('-');
                return `${month}/${day}/${year}`;
              })()
            : '-'
        }
        isLoading={isLoading}
      />
    </DashboardContent>
  );
}
