import { Iconify } from '@asyml8/ui';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

export const LoadingMessage = ({ message, size = 20 }: { message: string; size?: number }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
    <CircularProgress size={size} color="primary" />
    <Typography variant="body2" sx={{ color: 'text.primary', fontStyle: 'italic' }}>
      {message}
    </Typography>
  </Box>
);

export const renderStartIcon = (icon: string, isActive?: boolean) => (
  <Iconify
    icon={icon as any}
    sx={{ ml: 1, mr: 1, color: isActive ? 'primary.main' : 'text.disabled' }}
  />
);

export const handleCodeChange = (
  field: string,
  value: string,
  regex: RegExp,
  onChange: (field: string, value: string) => void
) => {
  const upper = value.toUpperCase();
  // Allow empty or any input that could eventually match the regex
  // Extract the character class from regex (e.g., [A-Z0-9] from /^[A-Z0-9]{2,10}$/)
  const charClassMatch = regex.source.match(/\[([^\]]+)\]/);
  if (charClassMatch) {
    const allowedChars = charClassMatch[1];
    const partialRegex = new RegExp(`^[${allowedChars}]*$`);
    if (upper === '' || partialRegex.test(upper)) {
      onChange(field, upper);
    }
  } else {
    // Fallback: just allow uppercase conversion
    onChange(field, upper);
  }
};
