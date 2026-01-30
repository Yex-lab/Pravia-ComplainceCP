# State Management Architecture

## Overview

This application uses a **hybrid state management approach** combining:
- **React Query** for data fetching and caching
- **Zustand** for state storage (API data + UI state)

## ⚠️ Important: Updating Zustand After Mutations

When using `createAppFormStore` with mutations, **you must manually update the Zustand store** after successful mutations. The `invalidateQueries` option only invalidates React Query cache, not Zustand.

### Pattern for Form Store Mutations

```typescript
// Lazy import helper to avoid circular dependencies
let appStore: any;
const getAppStore = async () => {
  if (!appStore) {
    const module = await import('src/store/app.store');
    appStore = module.useAppStore;
  }
  return appStore;
};

export const contactFormStore = createAppFormStore({
  updateFn: async (data: FormData) => {
    // 1. Perform the API mutation
    const updated = await withNotifications(
      async () => {
        return apiService.update(data.id, data);
      },
      {
        loading: 'Updating...',
        success: 'Updated successfully!',
        error: 'Failed to update.',
      }
    );

    // 2. Update Zustand store with the result
    const useAppStore = await getAppStore();
    const store = useAppStore.getState();
    const updatedItems = store.slices.items.data.map((item) =>
      item.id === updated.id ? { ...item, ...updated } : item
    );
    store.slices.items.setData(updatedItems);

    // 3. Return the updated data
    return updated;
  },
});
```

### Why This is Necessary

- `createAppFormStore` uses React Query mutations under the hood
- `invalidateQueries` only invalidates React Query cache
- If your UI reads from Zustand store (via `useContactsData()`), it won't see the update
- You must manually sync the mutation result back to Zustand

### Alternative: Use React Query Directly in Components

For components that need real-time updates, consider using React Query hooks directly:

```typescript
// Instead of reading from Zustand:
const contacts = useContactsData(); // Won't auto-update on mutations

// Use React Query directly:
const { data: contacts } = useQuery({
  queryKey: contactsQuery,
  queryFn: () => apiService.getContacts(orgId),
}); // Auto-updates when mutations invalidate the query
```

## Philosophy

**Single Source of Truth:** All application data lives in Zustand slices. React Query handles fetching and caching, but updates the Zustand store via callbacks. This provides:
- Centralized state accessible from anywhere
- React Query's powerful caching and refetching
- Full visibility in Redux DevTools
- Consistent access patterns across the app

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      app.store.ts                           │
│                    (Single Zustand Store)                   │
├─────────────────────────────────────────────────────────────┤
│  App State:                                                 │
│  ├── isInitialized                                          │
│  ├── initializationErrors                                   │
│  └── appConfig                                              │
│                                                             │
│  Slices (nested under state.slices):                       │
│  ├── contacts                                               │
│  │   ├── data: Contact[]              ← API data           │
│  │   ├── filters: ContactFilters      ← UI state           │
│  │   ├── selectedIds: string[]        ← UI state           │
│  │   ├── searchQuery: string          ← UI state           │
│  │   └── actions (setData, setFilters, etc.)               │
│  ├── accounts                                               │
│  │   ├── data: Account[]                                    │
│  │   ├── filters, selectedIds, searchQuery                  │
│  │   └── actions                                            │
│  ├── users                                                  │
│  │   ├── data: User[]                                       │
│  │   ├── filters, selectedIds, searchQuery                  │
│  │   └── actions                                            │
│  └── submissions                                            │
│      ├── data: Submission[]                                 │
│      ├── filters, selectedIds, searchQuery                  │
│      └── actions                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      React Query                            │
│              (Fetching & Caching Layer)                     │
├─────────────────────────────────────────────────────────────┤
│  Queries:                                                   │
│  ├── ['contacts'] → Fetches data → Updates slice.data      │
│  ├── ['accounts'] → Fetches data → Updates slice.data      │
│  ├── ['users-v2'] → Fetches data → Updates slice.data      │
│  └── ['submissions'] → Fetches data → Updates slice.data   │
│                                                             │
│  React Query handles:                                       │
│  ├── Caching & deduplication                                │
│  ├── Background refetching                                  │
│  ├── Stale-while-revalidate                                 │
│  └── Request cancellation                                   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
1. Component calls useContactsSlice()
   ↓
2. Gets data from Zustand: { data, filters, selectedIds }
   ↓
3. If data needs refresh, React Query fetches
   ↓
4. React Query onSuccess → Updates Zustand slice.data
   ↓
5. Component re-renders with new data
```

## File Structure

```
src/
├── store/                          # Renamed from stores (singular)
│   ├── app.store.ts                # Main Zustand store + selector hooks
│   ├── contacts.slice.ts           # Contacts: query + slice + data
│   ├── accounts.slice.ts           # Accounts: query + slice + data
│   ├── users.slice.ts              # Users: query + slice + data
│   ├── submissions.slice.ts        # Submissions: query + slice + data
│   ├── organization.slice.ts       # Organization: query only
│   ├── contact.form.ts             # Contact form helpers
│   ├── user.form.ts                # User form helpers
│   ├── user-add.form.ts            # Add user form helpers
│   └── index.ts                    # Barrel exports
```

## Slice Structure

Each slice contains:

```typescript
{
  // API Data (from server)
  data: T[],
  
  // UI State (client-side)
  filters: TFilters,
  selectedIds: string[],
  searchQuery: string,
  
  // Actions
  setData: (data: T[]) => void,
  setFilters: (filters: Partial<TFilters>) => void,
  resetFilters: () => void,
  setSelectedIds: (ids: string[]) => void,
  toggleSelected: (id: string) => void,
  clearSelected: () => void,
  setSearchQuery: (query: string) => void,
}
```

## Usage Patterns

### 1. Using Selector Hooks (Recommended)

```typescript
import { useContactsSlice } from 'src/store';

function ContactsList() {
  // Get everything from the slice
  const { data, filters, selectedIds, setFilters, toggleSelected } = useContactsSlice();
  
  // Data is already available - no need for useQuery!
  return (
    <div>
      {data.map(contact => (
        <ContactCard 
          key={contact.id}
          contact={contact}
          selected={selectedIds.includes(contact.id)}
          onToggle={() => toggleSelected(contact.id)}
        />
      ))}
    </div>
  );
}
```

### 2. Triggering Refetch (when needed)

```typescript
import { contactsQuery, useContactsSlice } from 'src/store';

function ContactsList() {
  const { data, setData } = useContactsSlice();
  
  // Use React Query for refetching
  const { refetch, isLoading } = contactsQuery.useQuery({
    onSuccess: (newData) => {
      setData(newData); // Update Zustand slice
    },
  });
  
  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      {isLoading ? 'Loading...' : data.map(...)}
    </div>
  );
}
```

### 3. Accessing Specific Values (better performance)

```typescript
import { useContactsFilters, useContactsData } from 'src/store';

function ContactsHeader() {
  // Only re-renders when filters change
  const filters = useContactsFilters();
  
  return <div>Status: {filters.status}</div>;
}

function ContactsCount() {
  // Only re-renders when data changes
  const data = useContactsData();
  
  return <div>Total: {data.length}</div>;
}
```

**Available Selector Hooks:**
- `useContactsSlice()` - Get entire slice
- `useContactsData()` - Get only data
- `useContactsFilters()` - Get only filters
- `useContactsSelected()` - Get only selectedIds
- (Same pattern for accounts, users, submissions)

## Initialization Flow

During app initialization:

```typescript
// 1. InitializeView calls services
const services = [
  {
    name: 'contacts',
    fn: () => queryClient.fetchQuery(['contacts'], fetchContacts),
    setter: (data) => {
      // Update Zustand slice with fetched data
      useAppStore.getState().slices.contacts.setData(data);
    },
  },
  // ... other services
];

// 2. Data is fetched and stored in Zustand
// 3. Components access data via useContactsSlice()
```

## Creating New Slices

### Step 1: Extend QuerySliceState with data

```typescript
// users.slice.ts
import { createQuerySlice, type QuerySliceState } from '@asyml8/ui';

type UserFilters = {
  role?: string;
  status?: string;
};

// Extend QuerySliceState to include data
export type UsersSlice = QuerySliceState<UserFilters> & {
  data: User[];
  setData: (data: User[]) => void;
};

export const createUsersSlice: StateCreator<UsersSlice> = (set, get, api) => ({
  // Spread the base query slice (filters, selections, etc.)
  ...createQuerySlice<UserFilters>({
    initialFilters: { role: 'all', status: 'active' },
  })(set, get, api),
  
  // Add data storage
  data: [],
  setData: (data) => set({ data }),
});
```

### Step 2: Add to service-config.ts

```typescript
{
  name: 'users',
  fn: () => queryClient.fetchQuery(['users'], fetchUsers),
  setter: (data) => {
    useAppStore.getState().slices.users.setData(data);
  },
  critical: false,
  message: 'Loading users...',
}
```

### Step 3: Add selector hooks to app.store.ts

```typescript
export const useUsersSlice = () => useAppStore((state) => state.slices.users);
export const useUsersData = () => useAppStore((state) => state.slices.users.data);
export const useUsersFilters = () => useAppStore((state) => state.slices.users.filters);
```

## Redux DevTools

The store is configured with Redux DevTools for debugging:

**Store Name:** `AppStore`

**Structure in DevTools:**
```
AppStore
├── isInitialized
├── initializationErrors
├── appConfig
└── slices
    ├── contacts
    │   ├── data: Contact[]          ← API data visible here
    │   ├── filters: { status: 'all' }
    │   ├── selectedIds: []
    │   └── searchQuery: ''
    ├── accounts
    │   ├── data: Account[]
    │   └── ...
    ├── users
    └── submissions
```

## Best Practices

1. **Access data via selector hooks** - `useContactsSlice()` or `useContactsData()`
2. **Use React Query for refetching** - Let it handle caching and deduplication
3. **Update Zustand in onSuccess** - Keep store in sync with fetched data
4. **Keep UI state in slices** - Filters, selections, search queries
5. **Use specific selectors** - Better performance (only re-render when needed)
6. **Don't duplicate data** - API data lives in slices, not appConfig

## Advantages of This Approach

✅ **Single source of truth** - All data in Zustand  
✅ **Centralized access** - No prop drilling  
✅ **Full visibility** - See everything in Redux DevTools  
✅ **React Query benefits** - Caching, deduplication, background refetch  
✅ **Type safety** - Full TypeScript support  
✅ **Scalable** - Easy to add new slices  
✅ **Testable** - Mock store or individual slices  
✅ **SSR/SSG ready** - Data in store, not just cache  

## Migration from Pure React Query

**Before:**
```typescript
const { data, isLoading } = useQuery(['contacts'], fetchContacts);
```

**After:**
```typescript
const { data } = useContactsSlice();
// Data is already available from initialization
```

## Related Documentation

- [STORE_USAGE.md](./STORE_USAGE.md) - Detailed usage guide with examples
- [packages/ui/src/lib/create-query-slice.ts](../../packages/ui/src/lib/create-query-slice.ts) - Slice factory
- [packages/ui/src/lib/create-slice.ts](../../packages/ui/src/lib/create-slice.ts) - Generic slice factory
