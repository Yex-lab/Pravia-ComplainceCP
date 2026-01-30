'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Iconify } from '../../../../components/data-display/iconify';

// ----------------------------------------------------------------------

export interface InfoCardProps {
  icon?: any;
  title: string;
  subtitle: string;
  isNavMini?: boolean;
  variant?: 'solid' | 'glassmorphism-light' | 'glassmorphism-dark' | 'transparent';
  subtitleVariant?: 'caption' | 'body2';
  maxLines?: number;
}

export function InfoCard({ 
  icon = 'solar:buildings-2-duotone' as any, 
  title, 
  subtitle,
  isNavMini = false,
  variant = 'glassmorphism-light',
  subtitleVariant = 'caption',
  maxLines = 2,
}: InfoCardProps) {
  const getCardStyles = (theme: any) => ({
    p: isNavMini ? 1.5 : 1.5,
    pl: isNavMini ? 1.5 : 1.5,
    m: 2,
    display: 'flex',
    alignItems: 'center',
    gap: isNavMini ? 0 : 1,
    justifyContent: isNavMini ? 'center' : 'flex-start',
    minHeight: isNavMini ? 56 : 'auto',
    cursor: 'default',
    borderRadius: 2,
    ...(variant === 'solid' && {
      bgcolor: theme.vars.palette.background.neutral,
    }),
    ...(variant === 'glassmorphism-light' && {
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid',
      borderColor: 'rgba(255, 255, 255, 0.15)',
    }),
    ...(variant === 'glassmorphism-dark' && {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid',
      borderColor: 'rgba(255, 255, 255, 0.08)',
    }),
    ...(variant === 'transparent' && {
      background: 'transparent',
    }),
  });

  if (isNavMini) {
    return (
      <Tooltip title={`${title} - ${subtitle}`} placement="right">
        <Card sx={getCardStyles}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 28,
            }}
          >
            <Iconify icon={icon} width={24} sx={{ color: 'primary.main' }} />
          </Box>
        </Card>
      </Tooltip>
    );
  }

  return (
    <Card sx={getCardStyles}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 42,
          flexShrink: 0,
          px: 0.5,
        }}
      >
        <Iconify icon={icon} width={32} sx={{ color: 'primary.main' }} />
      </Box>
      
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        
        <Typography 
          variant={subtitleVariant}
          sx={{ 
            color: 'text.secondary',
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: maxLines,
            WebkitBoxOrient: 'vertical',
          }}
          title={subtitle}
        >
          {subtitle}
        </Typography>
      </Box>
    </Card>
  );
}
