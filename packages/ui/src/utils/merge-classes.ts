/**
 * Merges class names conditionally
 * @param classes - Array of class names or objects with class names as keys and boolean conditions as values
 * @returns A string of merged class names
 */
export function mergeClasses(
  classes: (string | string[] | Record<string, boolean | undefined> | undefined)[],
  conditionalClasses?: Record<string, boolean | undefined>
): string {
  const classNames: string[] = [];

  // Process main classes array
  classes.forEach((item) => {
    if (!item) return;

    if (typeof item === 'string') {
      classNames.push(item);
    } else if (Array.isArray(item)) {
      classNames.push(...item.filter(Boolean));
    } else if (typeof item === 'object' && item !== null) {
      Object.entries(item).forEach(([key, value]) => {
        if (value) classNames.push(key);
      });
    }
  });

  // Process conditional classes if provided
  if (conditionalClasses) {
    Object.entries(conditionalClasses).forEach(([key, value]) => {
      if (value) classNames.push(key);
    });
  }

  return classNames.filter(Boolean).join(' ');
}
