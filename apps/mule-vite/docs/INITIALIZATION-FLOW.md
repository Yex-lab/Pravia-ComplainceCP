# Initialization Flow

This document describes how the application initialization works with TanStack Query integration.

## Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant InitializePage
    participant InitializeView
    participant ServiceConfig
    participant QueryStore
    participant QueryClient
    participant ServiceAPI
    participant Component

    User->>InitializePage: Navigate after auth
    InitializePage->>ServiceConfig: getServiceConfigs(userId)
    ServiceConfig-->>InitializePage: services[]
    
    InitializePage->>InitializeView: Render with services
    InitializeView->>InitializeView: loadServices()
    
    Note over InitializeView: Promise.allSettled for parallel loading
    
    loop For each service
        InitializeView->>ServiceConfig: service.fn()
        ServiceConfig->>QueryStore: store.fetch(queryFn)
        QueryStore->>QueryClient: fetchQuery({ queryKey, queryFn })
        QueryClient->>ServiceAPI: Execute queryFn
        ServiceAPI-->>QueryClient: Return data
        QueryClient->>QueryClient: Cache data + set query state
        QueryClient-->>QueryStore: Data cached
        QueryStore-->>ServiceConfig: Promise resolved
        ServiceConfig-->>InitializeView: Service loaded
    end
    
    InitializeView->>InitializeView: Check for errors
    
    alt All critical services succeed
        InitializeView->>InitializePage: onSuccess()
        InitializePage->>User: Navigate to dashboard
        User->>Component: Click menu item (e.g., Contacts)
        Component->>QueryStore: useQuery(config)
        QueryStore->>QueryClient: Check cache
        QueryClient-->>QueryStore: Data exists + fresh
        QueryStore-->>Component: Return cached data (no refetch)
    else Critical service fails
        InitializeView->>InitializeView: Show error + retry button
        InitializeView->>InitializePage: onError(errors)
    end
```

## Key Components

### 1. Service Configuration
```typescript
{
  name: 'contacts',
  fn: () => contactsStore.fetch(() => contactService.listContacts()),
  setter: () => {}, // No-op, fetch() handles setting data
  critical: false,
  message: 'Loading contacts...',
}
```

### 2. Query Store Fetch
```typescript
// Properly fetches and caches data through TanStack Query
contactsStore.fetch(() => contactService.listContacts())
```

### 3. Component Usage
```typescript
// Uses cached data from initialization, no refetch
const contactsQuery = contactsStore.useQuery(contactsQueryConfig);
```

## Why This Works

1. **Proper Query State**: `queryClient.fetchQuery()` sets data AND marks query as fetched with timestamp
2. **No Refetch**: When component calls `useQuery()`, React Query sees data is fresh (within `staleTime`)
3. **Parallel Loading**: All services load simultaneously via `Promise.allSettled()`
4. **Error Handling**: Failed services don't block non-critical data loading

## Configuration

Default query config prevents unnecessary refetches:
```typescript
{
  staleTime: 5 * 60 * 1000,      // 5 minutes
  gcTime: 30 * 60 * 1000,        // 30 minutes
  refetchOnMount: false,
  refetchOnWindowFocus: false,
}
```
