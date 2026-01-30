/**
 * Creates an rgba color value using CSS custom properties with channels.
 * 
 * @param color - RGB channel string or CSS variable with "Channel" suffix
 * @param opacity - Opacity value (0-1) or percentage string or CSS variable
 * @returns CSS rgba color string
 * 
 * @example
 * varAlpha('0 184 217', 0.48) // 'rgba(0 184 217 / 48%)'
 * varAlpha('var(--palette-primary-mainChannel)', 0.12) // 'rgba(var(--palette-primary-mainChannel) / 12%)'
 * varAlpha('currentColor', '50%') // 'color-mix(in srgb, currentColor 50%, transparent)'
 */
export function varAlpha(color: string, opacity: string | number = 1): string {
  if (!color?.trim()) {
    throw new Error('[Alpha]: Color is undefined or empty!');
  }

  // Check for unsupported formats
  if (
    color.startsWith('#') ||
    color.startsWith('rgb') ||
    color.startsWith('rgba') ||
    (!color.includes('var') && color.includes('Channel'))
  ) {
    throw new Error([
      `[Alpha]: Unsupported color format "${color}"`,
      '✅ Supported formats:',
      '- RGB channels: "0 184 217"',
      '- CSS variables with "Channel" prefix: "var(--palette-common-blackChannel, #000000)"',
      '❌ Unsupported formats:',
      '- Hex: "#00B8D9"',
      '- RGB: "rgb(0, 184, 217)"',
      '- RGBA: "rgba(0, 184, 217, 1)"',
    ].join('\n'));
  }

  const formatOpacity = (value: string | number, colorValue: string): string => {
    const isVariable = (v: string) => v.includes('var(--');
    const isPercentage = (v: string) => v.trim().endsWith('%');
    
    const errorMessages = {
      invalid: `[Alpha]: Invalid opacity "${value}" for ${colorValue}.`,
      range: 'Must be a number between 0 and 1 (e.g., 0.48).',
      format: 'Must be a percentage (e.g., "48%") or CSS variable (e.g., "var(--opacity)").',
    };

    if (typeof value === 'string') {
      if (isPercentage(value)) return value;
      if (isVariable(value)) return `calc(${value} * 100%)`;
      
      const numValue = parseFloat(value.trim());
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
        return `${Number((numValue * 100).toFixed(2))}%`;
      }
      
      throw new Error(`${errorMessages.invalid} ${errorMessages.format}`);
    }

    if (typeof value === 'number') {
      if (value >= 0 && value <= 1) {
        return `${Number((value * 100).toFixed(2))}%`;
      }
      throw new Error(`${errorMessages.invalid} ${errorMessages.range}`);
    }

    throw new Error(errorMessages.invalid);
  };

  const formattedOpacity = formatOpacity(opacity, color);

  // Handle currentColor specially
  if (color.toLowerCase() === 'currentcolor') {
    return `color-mix(in srgb, currentColor ${formattedOpacity}, transparent)`;
  }

  // Return rgba with CSS custom property channels
  return `rgba(${color} / ${formattedOpacity})`;
}
