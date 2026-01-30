'use client';

import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';

import { layoutClasses } from '../../core';

// ----------------------------------------------------------------------

export type MarketingContentProps = BoxProps & { layoutQuery?: Breakpoint };

export function MarketingContent({
  sx,
  children,
  className,
  layoutQuery = 'md',
  ...other
}: MarketingContentProps) {
  return (
    <Box
      className={mergeClasses([layoutClasses.content, className])}
      sx={[
        (theme) => ({
          width: 1,
          mx: 'auto',
          display: 'flex',
          flex: '1 1 auto',
          textAlign: 'center',
          flexDirection: 'column',
          maxWidth: 'var(--layout-simple-content-compact-width)',
          [theme.breakpoints.up(layoutQuery)]: {
            justifyContent: 'center',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </Box>
  );
}
