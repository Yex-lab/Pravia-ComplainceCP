# Initialization Flow Validation

## Manual Testing Steps

### Test 1: Verify No Duplicate API Calls

**Objective**: Ensure services loaded during initialization are not refetched when navigating to pages.

**Steps**:
1. Open browser DevTools → Network tab
2. Clear network log
3. Navigate to `/initialize` (after login)
4. **Record API calls during initialization**:
   - Should see: `GET /contacts` (once)
   - Should see: `GET /accounts/{id}` (once)
   - Should see: `GET /accounts` (once)
5. Wait for redirect to dashboard
6. Click on "Contacts" menu item
7. **Verify**: NO additional `GET /contacts` call
8. Click on "Organization" menu item  
9. **Verify**: NO additional `GET /accounts/{id}` call

**Expected Result**: 
- Each API endpoint called ONLY ONCE during initialization
- No duplicate calls when navigating to pages
- Data displays immediately without loading state

---

### Test 2: Verify Query State

**Objective**: Confirm queries are properly marked as fetched in React Query cache.

**Steps**:
1. Install React Query DevTools (if not already):
   ```tsx
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
   // Add to app: <ReactQueryDevtools />
   ```
2. Navigate to `/initialize`
3. Open React Query DevTools panel
4. After initialization completes, check query states:
   - `['contacts']` → status: "success", dataUpdatedAt: [timestamp]
   - `['organization']` → status: "success", dataUpdatedAt: [timestamp]
5. Navigate to Contacts page
6. **Verify**: Query shows "cached" or "fresh", NOT "fetching"

**Expected Result**:
- All queries show "success" status
- dataUpdatedAt timestamp is set
- No "fetching" state when navigating to pages

---

### Test 3: Verify Parallel Loading

**Objective**: Confirm all services load simultaneously, not sequentially.

**Steps**:
1. Open DevTools → Network tab
2. Throttle network to "Slow 3G"
3. Navigate to `/initialize`
4. Watch network requests
5. **Verify**: All API calls start at approximately the same time
6. Check console for timing logs

**Expected Result**:
- All service API calls initiated within ~100ms of each other
- Total load time ≈ slowest individual service (not sum of all)

---

### Test 4: Error Handling

**Objective**: Verify non-critical service failures don't block initialization.

**Steps**:
1. Temporarily modify service-config to make contacts non-critical
2. Mock contacts API to return 500 error
3. Navigate to `/initialize`
4. **Verify**: 
   - Toast notification shows contacts error
   - Initialization still completes
   - Redirects to dashboard
   - Other data (organization, accounts) loads successfully

**Expected Result**:
- Non-critical errors show toast but allow redirect
- Critical errors show retry button and block redirect

---

## Automated Validation (Future)

### Unit Test Checklist
- [ ] `contactsStore.fetch()` calls queryClient.fetchQuery
- [ ] Query state includes dataUpdatedAt timestamp
- [ ] useQuery with cached data doesn't trigger refetch
- [ ] Parallel Promise.allSettled completes all services
- [ ] Error handling respects critical flag

### Integration Test Checklist  
- [ ] Full initialization flow from InitializeView
- [ ] Navigation to pages uses cached data
- [ ] Query state persists across component mounts
- [ ] Failed services show appropriate UI

---

## Debug Commands

### Check Query Cache
```typescript
// In browser console
queryClient.getQueryData(['contacts'])
queryClient.getQueryState(['contacts'])
```

### Monitor Service Calls
```typescript
// Add to service functions
console.log('[SERVICE CALL]', endpoint, new Date().toISOString())
```

### Verify Store State
```typescript
// In browser console
contactsStore.getData()
organizationStore.getData()
```

---

## Known Issues

1. **Issue**: Services refetch on page navigation
   - **Cause**: Different queryFn used in initialization vs component
   - **Fix**: Use same queryFn from store config (e.g., `contactsQueryConfig.queryFn`)

2. **Issue**: Query shows as "stale" immediately
   - **Cause**: setData() doesn't mark query as fetched
   - **Fix**: Use `store.fetch()` instead of manual `fn() + setData()`

3. **Issue**: refetchOnMount still triggers fetch
   - **Cause**: No dataUpdatedAt timestamp in query state
   - **Fix**: Ensure queryClient.fetchQuery() is used, not setQueryData()
