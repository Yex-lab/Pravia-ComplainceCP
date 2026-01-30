import { m } from 'framer-motion';
import { ICONS, Iconify, varBounce, MotionContainer, CtaLiquidButton } from '@asyml8/ui';
import type { IconifyName } from '@asyml8/ui';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type ErrorViewProps = {
  code: number;
  title: string;
  description: string;
  actionButtonText?: string;
  actionButtonIcon?: IconifyName;
  showActionButton?: boolean;
  logo?: React.ReactNode;
  onActionClick?: () => void;
};

export function ErrorView({
  code,
  title,
  description,
  actionButtonText,
  actionButtonIcon = ICONS.HOME,
  showActionButton = true,
  logo,
  onActionClick,
}: ErrorViewProps) {
  return (
    <Container 
      component={MotionContainer} 
      sx={{ 
        textAlign: 'center', 
        py: 10,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {logo && (
        <m.div variants={varBounce('in')}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            {logo}
          </Box>
        </m.div>
      )}

      <m.div variants={varBounce('in')}>
        <Typography variant="h1" sx={{ fontSize: { xs: 80, md: 120 }, fontWeight: 700, mb: 2 }}>
          {code}
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {title}
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <Typography sx={{ color: 'text.secondary', maxWidth: 480, mx: 'auto', mb: 5 }}>
          {description}
        </Typography>
      </m.div>

      {showActionButton && onActionClick && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CtaLiquidButton
            onClick={onActionClick}
            startIcon={<Iconify icon={actionButtonIcon} />}
            sx={{ px: 4, py: 1.5, borderRadius: '12px' }}
          >
            {actionButtonText}
          </CtaLiquidButton>
        </Box>
      )}
    </Container>
  );
}
