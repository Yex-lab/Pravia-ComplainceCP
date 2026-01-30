'use client';

import type { ChipProps } from '@mui/material/Chip';
import type { Theme, SxProps } from '@mui/material/styles';

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const chipProps: ChipProps = { 
  size: 'small', 
  variant: 'filled',
  sx: {
    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
    color: (theme) => theme.palette.mode === 'dark' ? 'grey.100' : 'grey.800',
    '&:hover': {
      backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.700' : 'grey.200',
    },
  },
};

export type FiltersResultProps = React.ComponentProps<'div'> & {
  totalResults: number;
  onReset?: () => void;
  sx?: SxProps<Theme>;
};

export function FiltersResult({
  sx,
  onReset,
  children,
  totalResults,
  ...other
}: FiltersResultProps) {
  return (
    <ResultRoot sx={sx} {...other}>
      <ResultLabel>
        <strong>{totalResults}</strong>
        <span> results found</span>
      </ResultLabel>

      <ResultContent>
        {children}

        <Button
          color="error"
          onClick={onReset}
          size="small"
        >
          Clear
        </Button>
      </ResultContent>
    </ResultRoot>
  );
}

const ResultRoot = styled('div')(() => ({}));

const ResultLabel = styled('div')(({ theme }) => ({
  ...theme.typography.body2,
  marginBottom: theme.spacing(1.5),
  '& span': { color: theme.palette.text.secondary },
}));

const ResultContent = styled('div')(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
