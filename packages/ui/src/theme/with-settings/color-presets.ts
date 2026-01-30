import type { PaletteColorNoChannels } from '../core';

import { primary, secondary } from '../core/palette';

// ----------------------------------------------------------------------

export type ThemeColorPreset =
  | 'default'
  | 'preset1'
  | 'preset2'
  | 'preset3'
  | 'preset4'
  | 'preset5'
  | 'custom';

// Custom color storage
let customColors: PaletteColorNoChannels = {
  lighter: primary.lighter,
  light: primary.light,
  main: primary.main,
  dark: primary.dark,
  darker: primary.darker,
  contrastText: primary.contrastText,
};

let customSecondaryColors: PaletteColorNoChannels = {
  lighter: secondary.lighter,
  light: secondary.light,
  main: secondary.main,
  dark: secondary.dark,
  darker: secondary.darker,
  contrastText: secondary.contrastText,
};

export function setCustomColors(colors: Omit<PaletteColorNoChannels, 'contrastText'>) {
  customColors = {
    ...colors,
    contrastText: '#FFFFFF',
  };
}

export function setCustomSecondaryColors(colors: Omit<PaletteColorNoChannels, 'contrastText'>) {
  customSecondaryColors = {
    ...colors,
    contrastText: '#FFFFFF',
  };
}

export function getCustomColors(): PaletteColorNoChannels {
  return customColors;
}

export function getCustomSecondaryColors(): PaletteColorNoChannels {
  return customSecondaryColors;
}

const basePresets = {
  default: {
    lighter: primary.lighter,
    light: primary.light,
    main: primary.main,
    dark: primary.dark,
    darker: primary.darker,
    contrastText: primary.contrastText,
  },
  preset1: {
    lighter: '#FDE7D7',
    light: '#F8AC74',
    main: '#F4791F',
    dark: '#E1660B',
    darker: '#A84C08',
    contrastText: '#FFFFFF',
  },
  preset2: {
    lighter: '#EBD6FD',
    light: '#B985F4',
    main: '#7635dc',
    dark: '#431A9E',
    darker: '#200A69',
    contrastText: '#FFFFFF',
  },
  preset3: {
    lighter: '#CDE9FD',
    light: '#6BB1F8',
    main: '#0C68E9',
    dark: '#063BA7',
    darker: '#021D6F',
    contrastText: '#FFFFFF',
  },
  preset4: {
    lighter: '#FEF4D4',
    light: '#FED680',
    main: '#fda92d',
    dark: '#B66816',
    darker: '#793908',
    contrastText: '#1C252E',
  },
  preset5: {
    lighter: '#FFE3D5',
    light: '#FFC1AC',
    main: '#FF3030',
    dark: '#B71833',
    darker: '#7A0930',
    contrastText: '#FFFFFF',
  },
  custom: customColors,
};

export const primaryColorPresets: Record<ThemeColorPreset, PaletteColorNoChannels> = {
  ...basePresets,
  get custom() {
    return getCustomColors();
  },
};

export const secondaryColorPresets: Record<ThemeColorPreset, PaletteColorNoChannels> = {
  default: {
    lighter: secondary.lighter,
    light: secondary.light,
    main: secondary.main,
    dark: secondary.dark,
    darker: secondary.darker,
    contrastText: secondary.contrastText,
  },
  get custom() {
    return getCustomSecondaryColors();
  },
  preset1: {
    lighter: '#EAEEF6',
    light: '#8FA4CE',
    main: '#435F97',
    dark: '#5A78B6',
    darker: '#DBE5F0',
    contrastText: '#FFFFFF',
  },
  preset2: {
    lighter: '#D6E5FD',
    light: '#85A9F3',
    main: '#3562D7',
    dark: '#1A369A',
    darker: '#0A1967',
    contrastText: '#FFFFFF',
  },
  preset3: {
    lighter: '#FFF3D8',
    light: '#FFD18B',
    main: '#FFA03F',
    dark: '#B75D1F',
    darker: '#7A2D0C',
    contrastText: '#1C252E',
  },
  preset4: {
    lighter: '#FEEFD5',
    light: '#FBC182',
    main: '#F37F31',
    dark: '#AE4318',
    darker: '#741B09',
    contrastText: '#FFFFFF',
  },
  preset5: {
    lighter: '#FCF0DA',
    light: '#EEC18D',
    main: '#C87941',
    dark: '#904220',
    darker: '#601B0C',
    contrastText: '#FFFFFF',
  },
};
