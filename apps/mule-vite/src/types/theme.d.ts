import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter?: string;
    darker?: string;
    lighterChannel?: string;
    darkerChannel?: string;
  }

  interface CommonColors {
    blackChannel?: string;
    whiteChannel?: string;
  }

  interface ThemeVars {
    customShadows?: {
      z1?: string;
      z8?: string;
      [key: string]: any;
    };
  }
}

declare module '@mui/material/Tabs' {
  interface TabsPropsIndicatorColorOverrides {
    custom: true;
  }
}
