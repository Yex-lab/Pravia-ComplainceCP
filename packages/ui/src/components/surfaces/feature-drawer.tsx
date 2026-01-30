import type { ReactNode } from 'react';

import { ICONS, Iconify } from '@asyml8/ui';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

type FeatureDrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  titleChip?: {
    label: string;
  };
  backgroundImage?: string;
  backgroundGradient?: string;
  children: ReactNode;
  footer?: ReactNode;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  width?: number | string;
};

export function FeatureDrawer({
  open,
  onClose,
  title,
  subtitle,
  icon,
  iconColor = 'primary.main',
  iconSize = 40,
  titleChip,
  backgroundImage,
  backgroundGradient,
  children,
  footer,
  anchor = 'right',
  width = 600,
}: FeatureDrawerProps) {
  const hasHeaderBackground = !!(backgroundImage || backgroundGradient);

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width, display: 'flex', flexDirection: 'column' },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          position: 'relative',
          ...(hasHeaderBackground && {
            background: backgroundGradient || `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            py: 4,
            px: 3,
          }),
          ...(!hasHeaderBackground && {
            py: 2,
            px: 3,
          }),
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: hasHeaderBackground ? 'common.white' : 'text.primary',
          }}
        >
          <Iconify icon={ICONS.CLOSE} />
        </IconButton>

        {/* Icon and Text */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {icon && (
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: hasHeaderBackground ? 'rgba(255, 255, 255, 0.2)' : 'background.neutral',
                backdropFilter: hasHeaderBackground ? 'blur(10px)' : 'none',
              }}
            >
              <Iconify
                icon={icon as any}
                width={iconSize}
                sx={{ color: hasHeaderBackground ? 'common.white' : iconColor }}
              />
            </Box>
          )}

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  color: hasHeaderBackground ? 'common.white' : 'text.primary',
                  fontWeight: 600,
                }}
              >
                {title}
              </Typography>
              {titleChip && (
                <Chip
                  label={titleChip.label}
                  size="small"
                  color="success"
                  sx={{
                    height: 24,
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    '& .MuiChip-label': {
                      fontWeight: 800,
                      px: 1.5,
                    },
                  }}
                />
              )}
            </Box>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: hasHeaderBackground ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                  mt: 0.25,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {!hasHeaderBackground && <Divider />}

      {/* Content Section */}
      <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>{children}</Box>

      {/* Footer Section */}
      {footer && (
        <>
          <Divider />
          <Box sx={{ p: 3 }}>{footer}</Box>
        </>
      )}
    </Drawer>
  );
}
