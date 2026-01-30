import { createTheme as createMuiTheme } from '@mui/material/styles';
import { mixins } from './core/mixins';
import { components } from './core/components';
import { typography } from './core/typography';
import { shadows } from './core/shadows';
import { customShadows } from './core/custom-shadows';

const praviaColors = {
  primary: {
    lighter: '#C8FAD6',
    light: '#5BE49B',
    main: '#00A76F',
    dark: '#007867',
    darker: '#004B50',
    contrastText: '#FFFFFF',
  },
  secondary: {
    lighter: '#EFD6FF',
    light: '#C684FF',
    main: '#8E33FF',
    dark: '#5119B7',
    darker: '#27097A',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#FCFDFD',
    100: '#F9FAFB',
    200: '#F4F6F8',
    300: '#DFE3E8',
    400: '#C4CDD5',
    500: '#919EAB',
    600: '#637381',
    700: '#454F5B',
    800: '#1C252E',
    900: '#141A21',
  },
};

export const theme = createMuiTheme({
  palette: {
    mode: 'light',
    primary: praviaColors.primary,
    secondary: praviaColors.secondary,
    grey: praviaColors.grey,
  },
  typography,
  shape: {
    borderRadius: 8,
  },
  shadows: shadows.light,
  customShadows: customShadows.light,
  mixins,
  components,
});

export const darkTheme = createMuiTheme({
  palette: {
    mode: 'dark',
    primary: praviaColors.primary,
    secondary: praviaColors.secondary,
    grey: praviaColors.grey,
    background: {
      default: praviaColors.grey[900],
      paper: praviaColors.grey[800],
    },
  },
  typography,
  shape: {
    borderRadius: 8,
  },
  shadows: shadows.dark,
  customShadows: customShadows.dark,
  mixins,
  components,
});

// Export RGB channels for varAlpha usage
export const greyChannels = {
  50: '252 253 253',   // #FCFDFD
  100: '249 250 251',  // #F9FAFB
  200: '244 246 248',  // #F4F6F8
  300: '223 227 232',  // #DFE3E8
  400: '196 205 213',  // #C4CDD5
  500: '145 158 171',  // #919EAB
  600: '99 115 129',   // #637381
  700: '69 79 91',     // #454F5B
  800: '28 37 46',     // #1C252E
  900: '20 26 33',     // #141A21
};
