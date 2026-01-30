import Box from '@mui/material/Box';
import { mergeClasses } from 'minimal-shared/utils';
import { layoutClasses } from '../../../core';

interface SplitContentProps {
  children: React.ReactNode;
  sideContent?: React.ReactNode;
}

export function SplitContent({ children, sideContent }: SplitContentProps) {
  return (
    <>
      {/* Side Content - Hero section (narrower) */}
      <Box
        sx={(theme) => ({
          display: 'none',
          [theme.breakpoints.up('md')]: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.neutral',
            width: '40%',
            minHeight: '100vh',
          },
        })}
      >
        {sideContent || (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ typography: 'h4', mb: 2 }}>Welcome Back</Box>
            <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
              Sign in to continue to your account
            </Box>
          </Box>
        )}
      </Box>

      {/* Form Content - Wider form section */}
      <Box
        className={mergeClasses([layoutClasses.content])}
        sx={(theme) => ({
          display: 'flex',
          flex: '1 1 auto',
          alignItems: 'center',
          flexDirection: 'column',
          p: theme.spacing(3, 2, 10, 2),
          [theme.breakpoints.up('md')]: {
            justifyContent: 'center',
            p: theme.spacing(10, 4, 10, 4),
            width: '60%',
          },
        })}
      >
        <Box
          sx={{
            width: 1,
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 'var(--layout-auth-content-width)',
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
