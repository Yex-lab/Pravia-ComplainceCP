import { ICONS, Label, Iconify, StatCard } from '@asyml8/ui';

import { useTheme } from '@mui/material/styles';
import { Box, Card, Stack, Avatar, Typography, CardContent } from '@mui/material';

interface ComplianceBannerProps {
  organizationName: string;
  description: string;
  dueDateLabel: string;
  dueDate: string;
  stats: {
    validated: number;
    pendingReview: number;
    actionNeeded: number;
    rejected: number;
  };
  labels: {
    validated: string;
    pending: string;
    actionNeeded: string;
    rejected: string;
  };
  isLoading?: boolean;
}

export function ComplianceBanner({
  organizationName,
  description,
  dueDateLabel,
  dueDate,
  stats,
  labels,
  isLoading = false,
}: ComplianceBannerProps) {
  const theme = useTheme();

  return (
    <>
      <Card
        sx={{
          mb: 4,
          background: (th) =>
            `linear-gradient(135deg, ${th.palette.primary.main}70 0%, ${th.palette.secondary.main}65 100%)`,
          border: (th) => `1px solid ${th.palette.divider}`,
        }}
      >
        <CardContent sx={{ pt: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  background: (th) =>
                    `linear-gradient(135deg, ${th.palette.primary.light} 0%, ${th.palette.primary.dark} 100%)`,
                  border: 3,
                  borderColor: 'primary.light',
                }}
              >
                <Iconify icon="solar:buildings-bold-duotone" width={52} sx={{ color: 'white' }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {organizationName}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  {description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                  <Iconify icon={ICONS.CALENDAR} width={24} sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {dueDateLabel}
                  </Typography>
                  <Label
                    color="primary"
                    sx={{ fontWeight: 900, bgcolor: 'primary.main', color: 'primary.contrastText' }}
                  >
                    {dueDate}
                  </Label>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <StatCard
          borderVisible={false}
          value={stats.validated}
          loading={isLoading}
          label={labels.validated}
          icon={ICONS.CHECK_CIRCLE}
          color="success"
          size="small"
          layout="icon-left"
          sx={{
            flex: 1,
            '& .MuiTypography-root': { color: theme.vars?.palette.text.primary },
            '& .MuiTypography-caption': { textTransform: 'uppercase' },
          }}
        />
        <StatCard
          borderVisible={false}
          value={stats.pendingReview}
          loading={isLoading}
          label={labels.pending}
          icon={ICONS.CLOCK_CIRCLE}
          color="warning"
          size="small"
          layout="icon-left"
          sx={{
            flex: 1,
            '& .MuiTypography-root': { color: theme.vars?.palette.text.primary },
            '& .MuiTypography-caption': { textTransform: 'uppercase' },
          }}
        />
        <StatCard
          borderVisible={false}
          value={stats.actionNeeded}
          loading={isLoading}
          label={labels.actionNeeded}
          icon={ICONS.DANGER_TRIANGLE}
          color="error"
          size="small"
          layout="icon-left"
          sx={{
            flex: 1,
            '& .MuiTypography-root': { color: theme.vars?.palette.text.primary },
            '& .MuiTypography-caption': { textTransform: 'uppercase' },
          }}
        />
        <StatCard
          borderVisible={false}
          value={stats.rejected}
          loading={isLoading}
          label={labels.rejected}
          icon={ICONS.CLOSE_CIRCLE}
          color="error"
          size="small"
          layout="icon-left"
          sx={{
            flex: 1,
            '& .MuiTypography-root': { color: theme.vars?.palette.text.primary },
            '& .MuiTypography-caption': { textTransform: 'uppercase' },
          }}
        />
      </Stack>
    </>
  );
}
