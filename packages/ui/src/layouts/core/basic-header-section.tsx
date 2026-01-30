'use client';

import type { AppBarProps } from '@mui/material/AppBar';
import type { SxProps, Theme } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export interface BasicHeaderSectionProps extends Omit<AppBarProps, 'children'> {
  leftArea?: React.ReactNode;
  rightArea?: React.ReactNode;
  bgOpacity?: number;
  bgVisible?: boolean;
  sticky?: boolean;
}

export function BasicHeaderSection({
  leftArea,
  rightArea,
  bgOpacity = 0.8,
  bgVisible = true,
  sticky = true,
  sx,
  ...other
}: BasicHeaderSectionProps) {
  return (
    <AppBar
      position={sticky ? 'sticky' : 'static'}
      color="transparent"
      elevation={0}
      sx={[
        (theme) => ({
          height: 72,
          minHeight: 72,
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          backdropFilter: bgVisible ? 'blur(6px)' : 'none',
          WebkitBackdropFilter: bgVisible ? 'blur(6px)' : 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: bgVisible
              ? `rgba(${theme.vars.palette.background.defaultChannel} / ${bgOpacity})`
              : 'transparent',
            zIndex: -1,
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Toolbar
        sx={{
          height: '100%',
          minHeight: '72px !important',
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {leftArea}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {rightArea}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
