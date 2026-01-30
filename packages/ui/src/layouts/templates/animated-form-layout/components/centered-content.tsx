import Box from '@mui/material/Box';

interface CenteredContentProps {
  children: React.ReactNode;
  maxWidth?: string;
  variant?: 'solid' | 'glassmorphism-light' | 'glassmorphism-dark' | 'transparent';
  contentOffset?: string;
}

export function CenteredContent({ children, maxWidth = '600px', variant = 'glassmorphism-light', contentOffset = '0px' }: CenteredContentProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        px: 2,
        py: 5,
        transform: `translateY(${contentOffset})`,
      }}
    >
      <Box
        sx={(theme) => ({
          width: '100%',
          maxWidth,
          borderRadius: 2,
          p: { xs: 3, sm: 4, md: 5 },
          ...(variant === 'solid' && {
            bgcolor: theme.vars.palette.background.default,
            boxShadow: theme.vars.customShadows.z24,
          }),
          ...(variant === 'glassmorphism-light' && {
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: theme.vars.customShadows.z24,
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.3)',
          }),
          ...(variant === 'glassmorphism-dark' && {
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: theme.vars.customShadows.z24,
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.5)',
          }),
        })}
      >
        {children}
      </Box>
    </Box>
  );
}
