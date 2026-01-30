'use client';

import type { Theme, CSSObject } from '@mui/material/styles';

// ----------------------------------------------------------------------

type NavItemStyles = {
  icon: CSSObject;
  info: CSSObject;
  label: CSSObject;
  texts: CSSObject;
  disabled: CSSObject;
  captionIcon: CSSObject;
  title: (theme: Theme) => CSSObject;
  arrow: (theme: Theme) => CSSObject;
  captionText: (theme: Theme) => CSSObject;
};

export const navItemStyles: NavItemStyles = {
  icon: {
    width: 22,
    height: 22,
    flexShrink: 0,
    display: 'inline-flex',
    /**
     * As ':first-child' for ssr
     * https://github.com/emotion-js/emotion/issues/1105#issuecomment-1126025608
     */
    '& > :first-of-type:not(style):not(:first-of-type ~ *), & > style + *': {
      width: '100%',
      height: '100%',
    },
  },
  texts: { flex: '1 1 auto', display: 'inline-flex', flexDirection: 'column' },
  title: (theme: Theme) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: '1 1 auto',
  }),
  info: {
    fontSize: 11,
    flexShrink: 0,
    fontWeight: 700,
    marginLeft: 'auto',
    lineHeight: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20px',
    height: '20px',
    padding: '0 6px',
    borderRadius: '6px',
  },
  label: {
    fontSize: 11,
    flexShrink: 0,
    fontWeight: 700,
    marginLeft: '8px',
    lineHeight: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '24px',
    height: '24px',
    padding: '0 8px',
    borderRadius: '6px',
  },
  arrow: (theme: Theme) => ({
    width: 16,
    height: 16,
    flexShrink: 0,
    marginLeft: '6px',
    display: 'inline-flex',
    ...(theme.direction === 'rtl' && { transform: 'scaleX(-1)' }),
  }),
  captionIcon: { width: 16, height: 16 },
  captionText: (theme: Theme) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    ...theme.typography.caption,
  }),
  disabled: { opacity: 0.48, pointerEvents: 'none' },
};
