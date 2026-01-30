import Box from '@mui/material/Box';

interface SplitContentProps {
  children: React.ReactNode;
  sideContent?: React.ReactNode;
  formMaxWidth?: string;
  variant?: 'solid' | 'glassmorphism-light' | 'glassmorphism-dark' | 'transparent';
  contentOffset?: string;
}

export function SplitContent({ children, sideContent, formMaxWidth = '600px', variant = 'glassmorphism-light', contentOffset = '0px' }: SplitContentProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', md: 'row' },
        flex: 1,
        transform: `translateY(${contentOffset})`,
      }}
    >
      {/* Side content */}
      {sideContent && (
        <Box
          sx={{
            flex: { xs: 'none', md: 1 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, md: 5 },
          }}
        >
          {sideContent}
        </Box>
      )}

      {/* Form content */}
      <Box
        sx={{
          flex: { xs: 'none', md: 1 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 5 },
        }}
      >
        <Box 
          sx={(theme) => ({
            width: '100%',
            maxWidth: formMaxWidth,
            borderRadius: 2,
            pt: { xs: 2, sm: 2.5, md: 3 },
            px: { xs: 3, sm: 4, md: 5 },
            pb: { xs: 3, sm: 4, md: 5 },
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
    </Box>
  );
}
