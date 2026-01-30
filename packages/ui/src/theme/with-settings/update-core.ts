import type { ColorSystem } from '@mui/material/styles';
import type { ThemeSettingsState } from '../settings-types';
import type { ThemeOptions, ThemeColorScheme } from '../types';

import { setFont, hexToRgbChannel, createPaletteChannel } from 'minimal-shared/utils';

import type { ThemeColorPreset } from './color-presets';

import { primaryColorPresets, secondaryColorPresets, getCustomColors, getCustomSecondaryColors } from './color-presets';
import { createShadowColor } from '../core/custom-shadows';

// ----------------------------------------------------------------------

/**
 * Updates the core theme with the provided settings state.
 * @param theme - The base theme options to update.
 * @param settingsState - The settings state containing direction, fontFamily, contrast, and primaryColor.
 * @returns Updated theme options with applied settings.
 */

export function applySettingsToTheme(
  theme: ThemeOptions,
  settingsState?: ThemeSettingsState
): ThemeOptions {
  const {
    direction,
    fontFamily,
    contrast = 'default',
    primaryColor = 'default',
  } = settingsState ?? {};

  const isDefaultContrast = contrast === 'default';
  const isDefaultPrimaryColor = primaryColor === 'default';

  const lightPalette = theme.colorSchemes?.light?.palette as ColorSystem['palette'];

  // Get custom colors dynamically if custom preset is selected
  const presetColors = primaryColor === 'custom' 
    ? getCustomColors() 
    : primaryColorPresets[primaryColor as ThemeColorPreset];
  
  const secondaryPresetColors = primaryColor === 'custom'
    ? getCustomSecondaryColors()
    : secondaryColorPresets[primaryColor as ThemeColorPreset];
  
  const primaryColorPalette = createPaletteChannel(presetColors);
  const secondaryColorPalette = createPaletteChannel(secondaryPresetColors);

  const updateColorScheme = (schemeName: ThemeColorScheme) => {
    const currentScheme = theme.colorSchemes?.[schemeName];

    const updatedPalette = {
      ...currentScheme?.palette,
      ...(!isDefaultPrimaryColor && {
        primary: primaryColorPalette,
        secondary: secondaryColorPalette,
      }),
      ...(schemeName === 'light' && {
        background: {
          ...lightPalette?.background,
          ...(!isDefaultContrast && {
            default: lightPalette.grey[200],
            defaultChannel: hexToRgbChannel(lightPalette.grey[200]),
          }),
        },
      }),
    };

    const updatedCustomShadows = {
      ...currentScheme?.customShadows,
      ...(!isDefaultPrimaryColor && {
        primary: createShadowColor(primaryColorPalette.mainChannel),
        secondary: createShadowColor(secondaryColorPalette.mainChannel),
      }),
    };

    return {
      ...(currentScheme || {}),
      palette: updatedPalette as any,
      customShadows: updatedCustomShadows,
    } as any;
  };

  return {
    ...theme,
    direction,
    colorSchemes: {
      light: updateColorScheme('light'),
      dark: updateColorScheme('dark'),
    },
    typography: {
      ...theme.typography,
      fontFamily: setFont(fontFamily),
    },
  };
}
