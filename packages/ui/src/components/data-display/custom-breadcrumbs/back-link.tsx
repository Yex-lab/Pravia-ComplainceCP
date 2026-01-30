import type { LinkProps } from '@mui/material/Link';
import type { Theme } from '@mui/material/styles';

import Link from '@mui/material/Link';
 

import { Iconify, iconifyClasses, type IconifyName } from '../iconify';
import { RouterLink } from '../../navigation/router-link';

// ----------------------------------------------------------------------

export type BackLinkProps = LinkProps & {
  label?: string;
  icon?: IconifyName;
};

export function BackLink({ sx, label, icon = 'eva:chevron-left-outline', ...other }: BackLinkProps) {
  return (
    <Link
      component={RouterLink}
      color="inherit"
      underline="none"
      sx={[
        (theme: Theme) => ({
          position: 'relative',
          verticalAlign: 'middle',
          [`& .${iconifyClasses.root}`]: {
            position: 'absolute',
            left: '-40px',
            top: '50%',
            transform: 'translateY(-50%)',
            transition: theme.transitions.create(['opacity'], {
              duration: theme.transitions.duration.shorter,
              easing: theme.transitions.easing.sharp,
            }),
          },
          '&:hover': {
            [`& .${iconifyClasses.root}`]: {
              opacity: 0.48,
            },
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Iconify width={36} icon={icon} />
      {label}
    </Link>
  );
}
