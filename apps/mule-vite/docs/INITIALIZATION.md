# Application Initialization System

## Overview

The initialization system loads all required application services in parallel after user authentication, providing a smooth loading experience with animated feedback.

## Architecture

### Components

1. **InitializeView** (`@asyml8/ui/views/initialize`)
   - Reusable view component from the UI package
   - Displays animated logo and rotating loading messages
   - Handles parallel service loading with error collection
   - Fully customizable (logo, background animations, messages)

2. **InitializePage** (`src/pages/initialize.tsx`)
   - Application-specific implementation
   - Configures services to load
   - Provides app-specific logo and background animations
   - Handles success/error navigation

3. **Service Configuration** (`src/services/service-config.ts`)
   - Defines all services to load during initialization
   - Each service includes: name, loading function, setter, critical flag, and message

4. **App Store** (`src/stores/app-store.ts`)
   - Zustand store for application-level data
   - Stores loaded service data (userProfile, organization, accounts, etc.)
   - Tracks initialization errors

5. **Initialization Error Page** (`src/pages/error/initialization-error.tsx`)
   - Displays all service errors after initialization fails
   - Provides retry and navigation options

## Flow Diagram

```
┌─────────────────┐
│  User Logs In   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  /initialize    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  InitializeView Component           │
│  - Shows animated logo              │
│  - Rotates through service messages │
│  - Loads services in parallel       │
└────────┬────────────────────────────┘
         │
         ├─── All Services Load Successfully
         │    │
         │    ▼
         │    ┌──────────────────┐
         │    │   onSuccess()    │
         │    │  → /dashboard    │
         │    └──────────────────┘
         │
         └─── Critical Service Fails
              │
              ▼
              ┌──────────────────────────┐
              │      onError()           │
              │  → /error/initialization │
              └──────────────────────────┘
```

## Service Configuration

### Service Structure

```typescript
interface ServiceConfig {
  name: string;           // Unique identifier
  fn: () => Promise<T>;   // Async function to load data
  setter: (data: T) => void; // Zustand setter to store data
  critical: boolean;      // If true, failure blocks initialization
  message: string;        // Loading message to display
}
```

### Example Services

```typescript
const services = [
  {
    name: 'userProfile',
    fn: () => userService.getUser(userId),
    setter: store.setUserProfile,
    critical: true,  // Must succeed
    message: 'Loading your profile...'
  },
  {
    name: 'accounts',
    fn: () => accountService.listAccounts(),
    setter: store.setAccounts,
    critical: false,  // Can fail without blocking
    message: 'Loading accounts...'
  }
];
```

## Service Loading Process

1. **Parallel Execution**: All services load simultaneously using `Promise.allSettled()`
2. **No Blocking**: Non-critical service failures don't prevent app access
3. **Error Collection**: All errors are collected and displayed together
4. **State Updates**: Successful services immediately update Zustand store
5. **Single Load**: `useRef` guard prevents double-loading

## Data Flow

```
Service Config → Promise.allSettled() → Results Processing
                                              │
                                              ├─ Success → setter(data) → Zustand Store
                                              │
                                              └─ Failure → Collect Error
                                                              │
                                                              ├─ Critical → onError()
                                                              └─ Non-Critical → Continue
```

## Critical vs Non-Critical Services

### Critical Services
- **Must succeed** for app to function
- Examples: User profile, permissions, organization data
- Failure triggers error page with retry option

### Non-Critical Services
- **Optional** - app works without them
- Examples: Notifications, preferences, cached data
- Failures are logged but don't block initialization

## Error Handling

### Error Collection
```typescript
interface ServiceError {
  service: string;   // Service name that failed
  error: string;     // Error message
  critical: boolean; // Whether it was critical
}
```

### Error Display
- All errors shown together on error page
- Critical errors highlighted in red
- Non-critical errors shown as warnings
- Retry button re-runs initialization
- Go Home button returns to landing page

## Customization

### Custom Logo
```typescript
<InitializeView
  logo={<AppLogo width={64} height={64} />}
  // or
  logo={<CustomCompanyLogo />}
/>
```

### Custom Background Animations
```typescript
<InitializeView
  backgroundAnimations={
    <>
      <ParticleEffect />
      <GradientBackground />
    </>
  }
/>
```

### Custom Messages
Messages come from service configuration:
```typescript
{
  name: 'customService',
  message: 'Your custom loading message...'
}
```

## Routes

- `/initialize` - Main initialization page
- `/error/initialization` - Error page for failed initialization

## State Management

### App Store Structure
```typescript
{
  userProfile: any | null,
  organization: any | null,
  accounts: any[] | null,
  contacts: any[] | null,
  permissions: any | null,
  appConfig: any | null,
  isInitialized: boolean,
  initializationErrors: ServiceError[]
}
```

## Best Practices

1. **Keep Services Focused**: Each service should load one specific data type
2. **Mark Critical Correctly**: Only mark truly essential services as critical
3. **Provide Clear Messages**: Use descriptive loading messages for better UX
4. **Handle Errors Gracefully**: Non-critical failures shouldn't break the app
5. **Store Data Properly**: Use Zustand setters to maintain single source of truth

## Adding New Services

1. Add service to `service-config.ts`:
```typescript
{
  name: 'newService',
  fn: () => newService.getData(),
  setter: store.setNewData,
  critical: false,
  message: 'Loading new data...'
}
```

2. Add state to `app-store.ts`:
```typescript
newData: any | null,
setNewData: (data: any) => void,
```

3. Service automatically loads on initialization

## Performance Considerations

- All services load in parallel (not sequential)
- No waterfall loading - maximum efficiency
- Single load guarantee prevents duplicate API calls
- Message rotation keeps user engaged during loading

## Testing

### Test Scenarios
1. All services succeed
2. Non-critical service fails
3. Critical service fails
4. Multiple services fail
5. Network timeout
6. User not authenticated

### Mock Services
```typescript
const mockService = {
  name: 'test',
  fn: () => Promise.resolve({ data: 'test' }),
  setter: (data) => console.log(data),
  critical: false,
  message: 'Testing...'
};
```

## Troubleshooting

### Services Loading Twice
- Check that services array is memoized with `useMemo`
- Verify `useRef` guard is in place in InitializeView

### Stuck on Loading Screen
- Check browser console for errors
- Verify all service endpoints are accessible
- Check authentication token is valid

### Wrong Data in Store
- Verify setter functions are correct
- Check service response structure matches expected type
- Ensure no race conditions between services

## Future Enhancements

- Progress bar showing % of services loaded
- Retry individual failed services
- Service dependency management (load A before B)
- Timeout handling for slow services
- Offline mode with cached data
