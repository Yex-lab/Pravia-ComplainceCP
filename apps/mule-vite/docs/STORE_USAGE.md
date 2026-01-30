# Store Usage Guide

## Quick Start

Access all your data and UI state from a single place:

```typescript
import { useContactsSlice } from 'src/store';

function MyComponent() {
  const { data, filters, selectedIds, setFilters, toggleSelected } = useContactsSlice();
  
  return (
    <div>
      {data.map(contact => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
}
```

## Available Selector Hooks

### Contacts
```typescript
useContactsSlice()      // Get entire slice (data + filters + selections + actions)
useContactsData()       // Get only data array
useContactsFilters()    // Get only filters
useContactsSelected()   // Get only selectedIds
```

### Accounts
```typescript
useAccountsSlice()
useAccountsData()
useAccountsFilters()
```

### Users
```typescript
useUsersSlice()
useUsersData()
useUsersFilters()
```

### Submissions
```typescript
useSubmissionsSlice()
useSubmissionsData()
useSubmissionsFilters()
```

## Usage Patterns

### Pattern 1: Get Everything (most common)

```typescript
import { useContactsSlice } from 'src/store';

function ContactsList() {
  const { 
    data,              // Contact[] - API data
    filters,           // { status: string } - UI state
    selectedIds,       // string[] - UI state
    setData,           // Update data
    setFilters,        // Update filters
    toggleSelected,    // Toggle selection
    clearSelected,     // Clear selections
  } = useContactsSlice();
  
  return (
    <div>
      <FilterBar 
        filters={filters} 
        onChange={setFilters} 
      />
      
      {data
        .filter(c => filters.status === 'all' || c.status === filters.status)
        .map(contact => (
          <ContactCard
            key={contact.id}
            contact={contact}
            selected={selectedIds.includes(contact.id)}
            onToggle={() => toggleSelected(contact.id)}
          />
        ))}
      
      {selectedIds.length > 0 && (
        <BulkActions 
          count={selectedIds.length}
          onClear={clearSelected}
        />
      )}
    </div>
  );
}
```

### Pattern 2: Get Specific Values (better performance)

```typescript
import { useContactsData, useContactsFilters } from 'src/store';

// This component only re-renders when data changes
function ContactsCount() {
  const data = useContactsData();
  return <div>Total Contacts: {data.length}</div>;
}

// This component only re-renders when filters change
function ContactsFilterStatus() {
  const filters = useContactsFilters();
  return <div>Showing: {filters.status}</div>;
}
```

### Pattern 3: Refetch Data

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
  
  const handleRefresh = async () => {
    await refetch();
  };
  
  return (
    <div>
      <button onClick={handleRefresh} disabled={isLoading}>
        {isLoading ? 'Refreshing...' : 'Refresh'}
      </button>
      {data.map(contact => ...)}
    </div>
  );
}
```

### Pattern 4: Computed Values

```typescript
import { useContactsSlice } from 'src/store';
import { useMemo } from 'react';

function ContactsList() {
  const { data, filters, searchQuery } = useContactsSlice();
  
  // Compute filtered data
  const filteredData = useMemo(() => {
    return data
      .filter(c => filters.status === 'all' || c.status === filters.status)
      .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [data, filters, searchQuery]);
  
  return (
    <div>
      {filteredData.map(contact => ...)}
    </div>
  );
}
```

### Pattern 5: Direct Store Access (when needed)

```typescript
import { useAppStore } from 'src/store';

function SomeComponent() {
  // Access app-level state
  const isInitialized = useAppStore((state) => state.isInitialized);
  const appConfig = useAppStore((state) => state.appConfig);
  
  // Access nested slice data
  const contactsData = useAppStore((state) => state.slices.contacts.data);
  
  return <div>Initialized: {isInitialized}</div>;
}
```

## Working with Forms

### Creating a New Contact

```typescript
import { contactService } from 'src/services';
import { useContactsSlice } from 'src/store';

function AddContactForm() {
  const { data, setData } = useContactsSlice();
  
  const handleSubmit = async (formData) => {
    // Create contact via API
    const newContact = await contactService.createContact(formData);
    
    // Update Zustand slice with new data
    setData([...data, newContact]);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Updating a Contact

```typescript
function EditContactForm({ contactId }) {
  const { data, setData } = useContactsSlice();
  
  const handleSubmit = async (formData) => {
    // Update contact via API
    const updatedContact = await contactService.updateContact(contactId, formData);
    
    // Update Zustand slice
    setData(data.map(c => c.id === contactId ? updatedContact : c));
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Deleting a Contact

```typescript
function DeleteContactButton({ contactId }) {
  const { data, setData, selectedIds, setSelectedIds } = useContactsSlice();
  
  const handleDelete = async () => {
    // Delete via API
    await contactService.deleteContact(contactId);
    
    // Update Zustand slice
    setData(data.filter(c => c.id !== contactId));
    
    // Remove from selections if selected
    if (selectedIds.includes(contactId)) {
      setSelectedIds(selectedIds.filter(id => id !== contactId));
    }
  };
  
  return <button onClick={handleDelete}>Delete</button>;
}
```

## Performance Tips

### 1. Use Specific Selectors

```typescript
// ❌ Bad - Re-renders on any slice change
const slice = useContactsSlice();

// ✅ Good - Only re-renders when data changes
const data = useContactsData();
```

### 2. Memoize Computed Values

```typescript
const filteredData = useMemo(() => {
  return data.filter(c => c.status === filters.status);
}, [data, filters.status]); // Only recompute when these change
```

### 3. Use Shallow Equality for Objects

```typescript
import { shallow } from 'zustand/shallow';

const { filters, selectedIds } = useAppStore(
  (state) => ({ 
    filters: state.slices.contacts.filters,
    selectedIds: state.slices.contacts.selectedIds,
  }),
  shallow // Prevent re-render if values are the same
);
```

## Common Patterns

### Bulk Selection

```typescript
function ContactsList() {
  const { data, selectedIds, setSelectedIds, clearSelected } = useContactsSlice();
  
  const selectAll = () => setSelectedIds(data.map(c => c.id));
  const isAllSelected = selectedIds.length === data.length;
  
  return (
    <div>
      <button onClick={isAllSelected ? clearSelected : selectAll}>
        {isAllSelected ? 'Deselect All' : 'Select All'}
      </button>
    </div>
  );
}
```

### Filtered Count

```typescript
function FilteredCount() {
  const { data, filters } = useContactsSlice();
  
  const count = useMemo(() => {
    return data.filter(c => 
      filters.status === 'all' || c.status === filters.status
    ).length;
  }, [data, filters.status]);
  
  return <div>Showing {count} of {data.length} contacts</div>;
}
```

### Search with Debounce

```typescript
import { useDebouncedCallback } from 'use-debounce';

function SearchBar() {
  const { setSearchQuery } = useContactsSlice();
  
  const debouncedSearch = useDebouncedCallback(
    (value) => setSearchQuery(value),
    300
  );
  
  return (
    <input 
      type="search"
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="Search contacts..."
    />
  );
}
```

## Migration Guide

### From Pure React Query

**Before:**
```typescript
const { data, isLoading, error } = useQuery(['contacts'], fetchContacts);

if (isLoading) return <Loading />;
if (error) return <Error />;

return <div>{data.map(...)}</div>;
```

**After:**
```typescript
const { data } = useContactsSlice();

// Data is already available from initialization
return <div>{data.map(...)}</div>;
```

### From Props

**Before:**
```typescript
function Parent() {
  const [contacts, setContacts] = useState([]);
  return <Child contacts={contacts} />;
}

function Child({ contacts }) {
  return <div>{contacts.map(...)}</div>;
}
```

**After:**
```typescript
function Parent() {
  return <Child />;
}

function Child() {
  const { data } = useContactsSlice();
  return <div>{data.map(...)}</div>;
}
```

## Debugging

### View State in Redux DevTools

1. Open Redux DevTools
2. Select "AppStore" instance
3. Navigate to `slices` → `contacts`
4. See: `data`, `filters`, `selectedIds`, `searchQuery`

### Log State Changes

```typescript
const { data } = useContactsSlice();

useEffect(() => {
  console.log('Contacts data changed:', data);
}, [data]);
```

### Check if Data is Loaded

```typescript
const { data } = useContactsSlice();

if (data.length === 0) {
  return <EmptyState />;
}

return <ContactsList data={data} />;
```

## Best Practices

1. ✅ **Use selector hooks** - `useContactsSlice()` instead of `useAppStore`
2. ✅ **Use specific selectors** - `useContactsData()` for better performance
3. ✅ **Keep data in slices** - Don't duplicate in component state
4. ✅ **Update slice after mutations** - Keep store in sync with API
5. ✅ **Use React Query for refetching** - Let it handle caching
6. ✅ **Memoize computed values** - Prevent unnecessary recalculations
7. ❌ **Don't store data in appConfig** - Use slices instead
8. ❌ **Don't call useQuery everywhere** - Data is already in slices

## Related Documentation

- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) - Architecture overview
- [packages/ui/src/lib/create-query-slice.ts](../../packages/ui/src/lib/create-query-slice.ts) - Slice factory
