import { ICONS, Label, Iconify } from '@asyml8/ui';

import { Box, Card, Avatar, Typography, CardContent } from '@mui/material';

interface ComplianceBannerProps {
  organizationName: string;
  description: string;
  dueDateLabel: string;
  dueDate: string;
  isLoading?: boolean;
}

export function ComplianceBanner({
  organizationName,
  description,
  dueDateLabel,
  dueDate,
  isLoading = false,
}: ComplianceBannerProps) {
  return (
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
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
