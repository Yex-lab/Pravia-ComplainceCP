import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

type TermsAndConditionsFormProps = {
  termsAccepted: boolean;
  onTermsChange: (checked: boolean) => void;
  termsText: string;
  checkboxLabel: string;
  termsLinkText?: string;
  termsLinkHref?: string;
};

export function TermsAndConditionsForm({
  termsAccepted,
  onTermsChange,
  termsText,
  checkboxLabel,
  termsLinkText,
  termsLinkHref,
}: TermsAndConditionsFormProps) {
  return (
    <Stack spacing={3}>
      <TextField
        multiline
        rows={4}
        value={termsText}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />

      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Checkbox
          checked={termsAccepted}
          onChange={(e) => onTermsChange(e.target.checked)}
          sx={{ mt: -1 }}
        />
        <Typography variant="body2" color="text.secondary">
          {checkboxLabel}
          {termsLinkText && termsLinkHref && (
            <>
              {' '}
              <Box
                component="a"
                href={termsLinkHref}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {termsLinkText}
              </Box>
            </>
          )}
        </Typography>
      </Stack>
    </Stack>
  );
}
