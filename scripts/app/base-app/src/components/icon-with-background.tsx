import { Iconify } from '@asyml8/ui';

import { Box } from '@mui/material';

interface IconWithBackgroundProps {
  icon: string;
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'text.secondary';
  size?: number;
  iconSize?: number;
}

export function IconWithBackground({
  icon,
  color = 'primary',
  size = 24,
  iconSize = 16,
}: IconWithBackgroundProps) {
  const isTextColor = color === 'text.secondary';
  const bgColor = isTextColor ? 'text.secondary' : `${color}.main`;
  const iconColor = isTextColor ? 'text.secondary' : `${color}.main`;

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: '50%',
          bgcolor: bgColor,
          opacity: 0.15,
        }}
      />
      <Iconify
        icon={icon as any}
        width={iconSize}
        sx={{
          color: iconColor,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </Box>
  );
}
