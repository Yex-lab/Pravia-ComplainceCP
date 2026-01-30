import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type FormHeadProps = BoxProps & {
  icon?: React.ReactNode;
  logo?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  centered?: boolean;
  showDivider?: boolean;
};

export function FormHead({ sx, icon, logo, title, description, centered = true, showDivider = false, ...other }: FormHeadProps) {
  return (
    <>
      {logo && (
        <Box component="span" sx={{ mb: 2, mx: 'auto', display: 'flex', justifyContent: 'center' }}>
          {logo}
        </Box>
      )}

      {showDivider && (
        <Divider sx={{ mx: { xs: -3, sm: -4, md: -5 }, my: 0, mb: 2 }} />
      )}

      {icon && (
        <Box component="span" sx={{ mb: 3, mx: 'auto', display: 'inline-flex' }}>
          {icon}
        </Box>
      )}

      <Box
        sx={[
          () => ({
            mb: 5,
            gap: 1.5,
            display: 'flex',
            textAlign: centered ? 'center' : { xs: 'center', md: 'left' },
            whiteSpace: 'pre-line',
            flexDirection: 'column',
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Typography variant="h3">{title}</Typography>

        {description && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        )}
      </Box>
    </>
  );
}
