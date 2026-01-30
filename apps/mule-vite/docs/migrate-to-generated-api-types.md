# Migration Guide: Using Generated API Types, Services, and Slices

This guide outlines the steps to migrate components to use the generated API types, services, and slices from `@asyml8/api-types`.

## Overview

The `@asyml8/api-types` package provides auto-generated:
- **Types**: TypeScript interfaces from OpenAPI/Swagger specs
- **Services**: HTTP client methods for API endpoints
- **Slices**: Zustand store slices with queries and mutations

## Step 1: Replace Local Types with Generated Types

### Before:
```typescript
type StateEntity = {
  id: string;
  name: string;
  orgCode?: string;
  govCode?: string;
  acronym?: string;
};
```

### After:
```typescript
import type { FluxTypes } from '@asyml8/api-types';

// Use generated types
type Account = FluxTypes.AccountDto;
type Contact = FluxTypes.ContactResponseDto;
type AccessRequest = FluxTypes.AccessRequestDto;
```

## Step 2: Use Store Hooks Instead of Direct Store Access

### Before:
```typescript
const accountsPublic = useAppStore((state) => state.slices.accountsPublic.data);
```

### After:
```typescript
import { useAccountsPublicData } from 'src/store';

const accountsPublic = useAccountsPublicData();
```

### Available Store Hooks:
- `useAccountsData()` - User's organization accounts
- `useAccountsPublicData()` - All public accounts
- `useContactsData()` - Organization contacts
- `useAppConfig()` - App configuration (userId, organizationId, etc.)

## Step 3: Use Generated Services for API Calls

### Before:
```typescript
const response = await customService.someMethod(data);
```

### After:
```typescript
import { fluxServices } from 'src/services/flux.api';

const response = await fluxServices.accounts.updateAccountsById(id, data);
const accounts = await fluxServices.public.getPublicAccounts();
```

### Available Services:
- `fluxServices.accounts` - Account operations
- `fluxServices.public` - Public endpoints
- `fluxServices.contacts` - Contact operations
- `fluxServices.submissions` - Submission operations
- `foundryServices.userManagement` - User management
- `foundryServices.roles` - Role operations

## Step 4: Use Consistent Query Configuration

### Before:
```typescript
const { data } = useQuery({
  queryKey: ['custom-key'],
  queryFn: customFn,
});
```

### After:
```typescript
import { QUERY_KEYS, STALE_TIMES } from 'src/constants';
import { fluxServices } from 'src/services/flux.api';

const { data } = useQuery({
  queryKey: QUERY_KEYS.PUBLIC_ACCOUNTS,
  queryFn: () => fluxServices.public.getPublicAccounts(),
  staleTime: STALE_TIMES.PUBLIC_ACCOUNTS,
});
```

## Step 5: Use UI Notification Helpers

### Before:
```typescript
const addNotification = useNotificationStore((state) => state.addNotification);

addNotification({
  message: 'Success',
  type: 'success',
});
```

### After:
```typescript
import {
  showSuccess,
  showError,
  showNotification,
  dismissNotification,
} from '@asyml8/ui';

showSuccess('Success message');
showError('Error message');
```

## Step 6: Implement Mutations with Loading States

### Pattern:
```typescript
import { useMutation } from '@tanstack/react-query';
import { showSuccess, showError, showNotification, dismissNotification } from '@asyml8/ui';
import { CircularProgress } from '@mui/material';

const { mutate, isPending } = useMutation({
  mutationFn: async (data: FluxTypes.SomeDto) => {
    const loadingId = showNotification({
      type: 'info',
      message: 'Saving...',
      icon: <CircularProgress size={20} color="info" />,
      duration: null,
    });

    try {
      const result = await fluxServices.someResource.updateById(id, data);
      dismissNotification(loadingId);
      return result;
    } catch (error) {
      dismissNotification(loadingId);
      throw error;
    }
  },
  onSuccess: (data) => {
    // Update store if needed
    const store = useAppStore.getState();
    store.slices.someResource.setData(data);
    
    showSuccess('Saved successfully');
  },
  onError: (error) => {
    showError(`Failed to save: ${error.message}`);
  },
});
```

## Step 7: Update Store After Mutations

### Pattern:
```typescript
onSuccess: (updatedData) => {
  const store = useAppStore.getState();
  
  // Update specific item in array
  const updated = store.slices.accounts.data.map((item) =>
    item.id === id ? { ...item, ...updatedData } : item
  );
  store.slices.accounts.setData(updated);
  
  showSuccess('Updated successfully');
}
```

## Step 8: Configure Startup Services

Ensure data is loaded at startup and stored in the app store:

```typescript
// src/services/public-startup.services.ts
export const getPublicServiceConfigs = (queryClient: QueryClient) => {
  const store = useAppStore.getState();

  return [
    {
      name: SERVICE_NAMES.PUBLIC_ACCOUNTS,
      fn: () =>
        queryClient.fetchQuery({
          queryKey: QUERY_KEYS.PUBLIC_ACCOUNTS,
          queryFn: () => fluxServices.public.getPublicAccounts(),
          staleTime: STALE_TIMES.PUBLIC_ACCOUNTS,
        }),
      setter: (data) => {
        store.slices.accountsPublic.setData(data);
      },
      critical: true,
      message: i18n.t('startup.retrievingOrganizations', { ns: 'common' }),
    },
  ];
};
```

## Complete Example

See `src/sections/my-workspace/organization/view/organization-list-view.tsx` for a complete reference implementation.

## Checklist

- [ ] Replace local types with `FluxTypes` or `FoundryTypes`
- [ ] Use store hooks (`useAccountsPublicData`, etc.)
- [ ] Use generated services (`fluxServices`, `foundryServices`)
- [ ] Use `QUERY_KEYS` and `STALE_TIMES` constants
- [ ] Use UI notification helpers (`showSuccess`, `showError`)
- [ ] Implement loading notifications in mutations
- [ ] Update store after successful mutations
- [ ] Remove console.log debugging statements
- [ ] Remove unused imports and custom services
- [ ] Ensure startup services populate store slices

## Reference Files

- Types: `packages/api-types/src/api/flux/types.ts`
- Services: `packages/api-types/src/api/flux/services/`
- Store: `apps/mule-vite/src/store/app.store.ts`
- Constants: `apps/mule-vite/src/constants/service-config.ts`
- Example: `apps/mule-vite/src/sections/my-workspace/organization/view/organization-list-view.tsx`
