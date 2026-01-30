import type { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const bulletColor = { dark: '#5A6570', light: '#EDEFF2' };

function colorVars(
  theme: Theme,
  variant?: 'vertical' | 'mini' | 'horizontal',
  usePrimaryColor: boolean = true
) {
  // Use MUI's built-in CSS variables for color scheme support
  // These automatically switch between light/dark modes
  const vars = theme.vars ? {
    // When theme.vars exists (CSS variables mode), use MUI's CSS variables
    '--nav-item-color': theme.vars.palette.text.secondary,
    '--nav-item-hover-bg': theme.vars.palette.action.hover,
    '--nav-item-caption-color': theme.vars.palette.text.disabled,
    // root
    '--nav-item-root-active-color': usePrimaryColor ? theme.vars.palette.primary.main : theme.vars.palette.text.primary,
    '--nav-item-root-active-color-on-dark': usePrimaryColor
      ? theme.vars.palette.primary.light
      : theme.vars.palette.text.primary,
    '--nav-item-root-active-bg': usePrimaryColor
      ? `rgba(${theme.vars.palette.primary.mainChannel} / 0.08)`
      : theme.vars.palette.action.selected,
    '--nav-item-root-active-hover-bg': usePrimaryColor
      ? `rgba(${theme.vars.palette.primary.mainChannel} / 0.16)`
      : theme.vars.palette.action.hover,
    '--nav-item-root-open-color': theme.vars.palette.text.primary,
    '--nav-item-root-open-bg': theme.vars.palette.action.hover,
    // sub
    '--nav-item-sub-active-color': theme.vars.palette.text.primary,
    '--nav-item-sub-active-bg': theme.vars.palette.action.selected,
    '--nav-item-sub-open-color': theme.vars.palette.text.primary,
    '--nav-item-sub-open-bg': theme.vars.palette.action.hover,
    ...(variant === 'vertical' && {
      '--nav-item-sub-active-bg': theme.vars.palette.action.hover,
      '--nav-subheader-color': theme.vars.palette.text.disabled,
      '--nav-subheader-hover-color': theme.vars.palette.text.primary,
    }),
  } : {
    // Fallback for standard theme mode (without CSS variables)
    '--nav-item-color': theme.palette.text.secondary,
    '--nav-item-hover-bg': theme.palette.action.hover,
    '--nav-item-caption-color': theme.palette.text.disabled,
    '--nav-item-root-active-color': usePrimaryColor ? theme.palette.primary.main : theme.palette.text.primary,
    '--nav-item-root-active-color-on-dark': usePrimaryColor
      ? theme.palette.primary.light
      : theme.palette.text.primary,
    '--nav-item-root-active-bg': usePrimaryColor
      ? alpha(theme.palette.primary.main, 0.08)
      : theme.palette.action.selected,
    '--nav-item-root-active-hover-bg': usePrimaryColor
      ? alpha(theme.palette.primary.main, 0.16)
      : theme.palette.action.hover,
    '--nav-item-root-open-color': theme.palette.text.primary,
    '--nav-item-root-open-bg': theme.palette.action.hover,
    '--nav-item-sub-active-color': theme.palette.text.primary,
    '--nav-item-sub-active-bg': theme.palette.action.selected,
    '--nav-item-sub-open-color': theme.palette.text.primary,
    '--nav-item-sub-open-bg': theme.palette.action.hover,
    ...(variant === 'vertical' && {
      '--nav-item-sub-active-bg': theme.palette.action.hover,
      '--nav-subheader-color': theme.palette.text.disabled,
      '--nav-subheader-hover-color': theme.palette.text.primary,
    }),
  };

  return vars;
}

// ----------------------------------------------------------------------

function verticalVars(theme: Theme, usePrimaryColor: boolean = true) {
  const { shape } = theme;

  return {
    ...colorVars(theme, 'vertical', usePrimaryColor),
    '--nav-item-gap': '4px',
    '--nav-item-radius': `${shape.borderRadius}px`,
    '--nav-item-pt': '4px',
    '--nav-item-pr': '8px',
    '--nav-item-pb': '4px',
    '--nav-item-pl': '8px',
    // root
    '--nav-item-root-height': '44px',
    // sub
    '--nav-item-sub-height': '36px',
    // icon
    '--nav-icon-size': '24px',
    '--nav-icon-margin': '0 12px 0 0',
    // bullet
    '--nav-bullet-size': '12px',
    '--nav-bullet-light-color': bulletColor.light,
    '--nav-bullet-dark-color': bulletColor.dark,
  };
}

// ----------------------------------------------------------------------

function miniVars(theme: Theme) {
  const { shape } = theme;

  return {
    ...colorVars(theme, 'mini'),
    '--nav-item-gap': '4px',
    '--nav-item-radius': `${shape.borderRadius}px`,
    // root
    '--nav-item-root-height': '56px',
    '--nav-item-root-padding': '8px 4px 6px 4px',
    // sub
    '--nav-item-sub-height': '34px',
    '--nav-item-sub-padding': '0 8px',
    // icon
    '--nav-icon-size': '22px',
    '--nav-icon-root-margin': '0 0 6px 0',
    '--nav-icon-sub-margin': '0 8px 0 0',
  };
}

// ----------------------------------------------------------------------

function horizontalVars(theme: Theme) {
  const { shape } = theme;

  return {
    ...colorVars(theme, 'horizontal'),
    '--nav-item-gap': '6px',
    '--nav-height': '56px',
    '--nav-item-radius': `${Number(shape.borderRadius) * 0.75}px`,
    // root
    '--nav-item-root-height': '32px',
    '--nav-item-root-padding': '0 6px',
    // sub
    '--nav-item-sub-height': '34px',
    '--nav-item-sub-padding': '0 8px',
    // icon
    '--nav-icon-size': '22px',
    '--nav-icon-sub-margin': '0 8px 0 0',
    '--nav-icon-root-margin': '0 8px 0 0',
  };
}

// ----------------------------------------------------------------------

export const navSectionCssVars = {
  mini: miniVars,
  vertical: verticalVars,
  horizontal: horizontalVars,
};
