import Box from '@mui/material/Box';
import { mergeClasses } from 'minimal-shared/utils';
import { layoutClasses } from '../../../core';

interface CenteredContentProps {
  children: React.ReactNode;
}

export function CenteredContent({ children }: CenteredContentProps) {
  return (
    <Box
      className={mergeClasses([layoutClasses.content])}
      sx={(theme) => ({
        py: 5,
        px: 3,
        width: 1,
        zIndex: 1,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 'var(--layout-auth-content-width)',
        bgcolor: theme.vars.palette.background.default,
      })}
    >
      {children}
    </Box>
  );
}
