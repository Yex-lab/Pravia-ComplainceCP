# Icon Constants Usage Guide

## Overview

The `ICONS` constant provides type-safe access to all registered Iconify icons, eliminating hardcoded strings and enabling autocomplete.

## Basic Usage

### Before (hardcoded strings)
```tsx
import { Iconify } from '@asyml8/ui';

<Iconify icon="solar:home-bold" />
<Iconify icon="eva:trash-2-fill" />
<Iconify icon="solar:user-rounded-bold-duotone" />
```

### After (using constants)
```tsx
import { Iconify, ICONS } from '@asyml8/ui';

<Iconify icon={ICONS.HOME} />
<Iconify icon={ICONS.TRASH} />
<Iconify icon={ICONS.USER_ROUNDED_DUOTONE} />
```

## Benefits

1. **Autocomplete**: Get IDE suggestions for all available icons
2. **Type Safety**: Catch typos at compile time
3. **Refactoring**: Easy to find and update icon usage
4. **Documentation**: Clear naming shows icon purpose

## Examples

### Navigation Icons
```tsx
import { ICONS } from '@asyml8/ui';

<Iconify icon={ICONS.HOME} />
<Iconify icon={ICONS.SETTINGS} />
<Iconify icon={ICONS.USER} />
<Iconify icon={ICONS.BELL} />
<Iconify icon={ICONS.LOGOUT} />
```

### Action Icons
```tsx
import { ICONS } from '@asyml8/ui';

<Iconify icon={ICONS.UPLOAD} />
<Iconify icon={ICONS.DOWNLOAD} />
<Iconify icon={ICONS.COPY} />
<Iconify icon={ICONS.TRASH} />
<Iconify icon={ICONS.PEN} />
```

### Status Icons
```tsx
import { ICONS } from '@asyml8/ui';

<Iconify icon={ICONS.CHECK_CIRCLE} />
<Iconify icon={ICONS.CLOSE_CIRCLE} />
<Iconify icon={ICONS.DANGER} />
<Iconify icon={ICONS.INFO_CIRCLE} />
<Iconify icon={ICONS.VERIFIED_CHECK} />
```

### Social Icons
```tsx
import { ICONS } from '@asyml8/ui';

<Iconify icon={ICONS.LINKEDIN} />
<Iconify icon={ICONS.FACEBOOK} />
<Iconify icon={ICONS.TWITTER} />
<Iconify icon={ICONS.GITHUB} />
```

## Type Safety

The `IconName` type ensures only valid icon strings are used:

```tsx
import type { IconName } from '@asyml8/ui';

const myIcon: IconName = ICONS.HOME; // ✅ Valid
const badIcon: IconName = 'invalid:icon'; // ❌ Type error
```

## Finding Icons

All icons are organized by category in the `ICONS` object:

- **Eva Icons**: `TRASH`, `CHEVRON_LEFT`, `STAR_FILL`, etc.
- **Solar Icons**: `HOME`, `USER`, `SETTINGS`, `BELL`, etc.
- **IC Icons**: `SENTIMENT_*`, `FORMAT_*`, `VIEW_*`, etc.
- **Mingcute Icons**: `CALENDAR_*`, `ADD`, `MINIMIZE`, etc.
- **Carbon Icons**: `MENU`, `ZOOM_IN`, `PLAY_CARBON`, etc.
- **Social Icons**: `LINKEDIN`, `FACEBOOK`, `TWITTER`, etc.
- **Payment Icons**: `MASTERCARD`, `VISA`, `PAYPAL`
- **Custom Icons**: `MENU_DUOTONE`, `INVOICE_DUOTONE`, etc.

## Migration

To migrate existing code:

1. Import `ICONS` from `@asyml8/ui`
2. Replace hardcoded strings with `ICONS.*` constants
3. Use IDE search/replace for common patterns

Example migration:
```tsx
// Find: icon="solar:home-bold"
// Replace: icon={ICONS.HOME}
```
