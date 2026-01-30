import { ICONS, Iconify } from '@asyml8/ui';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

import { useTranslation } from 'src/hooks/use-translation';

type FormActionsProps = {
  onBack?: () => void;
  onNext?: () => void;
  onCancel?: () => void;
  onSubmit?: () => void;
  nextLabel?: string;
  submitLabel?: string;
  nextDisabled?: boolean;
  submitDisabled?: boolean;
  isSubmitting?: boolean;
  showDivider?: boolean;
};

export function FormActions({
  onBack,
  onNext,
  onCancel,
  onSubmit,
  nextLabel,
  submitLabel,
  nextDisabled = false,
  submitDisabled = false,
  isSubmitting = false,
  showDivider = true,
}: FormActionsProps) {
  const { t } = useTranslation();

  return (
    <>
      {showDivider && <Divider sx={{ mt: 1, mx: -3 }} />}
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }} data-form-actions>
        <Stack direction="row" spacing={1}>
          {onBack && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={onBack}
              startIcon={<Iconify icon={ICONS.ARROW_IOS_BACK} />}
            >
              {t('register.actions.back')}
            </Button>
          )}
          {onCancel && (
            <Button variant="outlined" color="inherit" onClick={onCancel}>
              {t('register.actions.cancel')}
            </Button>
          )}
        </Stack>
        <Stack direction="row" spacing={1}>
          {onNext && (
            <Button
              variant="contained"
              disabled={nextDisabled}
              onClick={onNext}
              endIcon={<Iconify icon={ICONS.ARROW_IOS_FORWARD} />}
            >
              {nextLabel || t('register.actions.next')}
            </Button>
          )}
          {onSubmit && (
            <Button
              variant="contained"
              disabled={submitDisabled || isSubmitting}
              onClick={onSubmit}
              endIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Iconify icon={ICONS.CHECK_CIRCLE} />
                )
              }
            >
              {isSubmitting
                ? t('register.actions.submitting')
                : submitLabel || t('register.actions.submit')}
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );
}
