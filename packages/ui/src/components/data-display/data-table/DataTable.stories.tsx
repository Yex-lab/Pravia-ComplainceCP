import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Container } from '@mui/material';
import { DataTable } from './data-table';
import type { Column, FilterTab, SearchConfig } from './data-table';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  status: 'active' | 'pending' | 'banned' | 'rejected';
}

const mockUsers: User[] = [
  { id: '1', name: 'Christopher Cardenas', email: 'lenna.bergnaum27@hotmail.com', phone: '(555) 123-4567', company: 'Attenwerth, Medhurst and Roberts', role: 'Data Analyst', status: 'rejected' },
  { id: '2', name: 'Giana Brandt', email: 'dwight.block85@yahoo.com', phone: '(555) 234-5678', company: 'Dare - Treutel', role: 'Business Consultant', status: 'pending' },
  { id: '3', name: 'Selina Boyer', email: 'dawn.goyette@gmail.com', phone: '(555) 345-6789', company: 'Dibbert Inc', role: 'Quality Assurance Tester', status: 'pending' },
  { id: '4', name: 'Lainey Davidson', email: 'aditya.greenfelder31@gmail.com', phone: '(555) 456-7890', company: 'Durgan - Murazik', role: 'Marketing Strategist', status: 'pending' },
  { id: '5', name: 'Ariana Lang', email: 'avery43@hotmail.com', phone: '(555) 567-8901', company: 'Feest Group', role: 'IT Administrator', status: 'pending' },
];

const fetchUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUsers;
};

const fetchUsersLoading = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 10000)); // Long delay to show loading
  return mockUsers;
};

const columns: Column<User>[] = [
  {
    id: 'name',
    label: 'Name',
    sortable: true,
    render: (_, user) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#1976d2',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 600
        }}>
          {user.name.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{user.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
        </div>
      </div>
    ),
  },
  {
    id: 'phone',
    label: 'Phone number',
    width: 180,
  },
  {
    id: 'company',
    label: 'Company',
    width: 220,
    sortable: true,
  },
  {
    id: 'role',
    label: 'Role',
    width: 180,
  },
  {
    id: 'status',
    label: 'Status',
    width: 100,
    render: (status) => (
      
      <span style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: 
          status === 'active' ? '#e8f5e8' :
          status === 'pending' ? '#fff3cd' :
          status === 'banned' ? '#f8d7da' :
          '#e2e3e5',
        color:
          status === 'active' ? '#2e7d32' :
          status === 'pending' ? '#ed6c02' :
          status === 'banned' ? '#d32f2f' :
          '#6c757d',
        textTransform: 'capitalize'
      }}>
        {status}
      </span>
    ),
  },
];

const filterTabs: FilterTab<User>[] = [
  {
    id: 'all',
    label: 'All',
    filter: (data) => data,
    color: 'default',
  },
  {
    id: 'active',
    label: 'Active',
    filter: (data) => data.filter(user => user.status === 'active'),
    color: 'success',
  },
  {
    id: 'pending',
    label: 'Pending',
    filter: (data) => data.filter(user => user.status === 'pending'),
    color: 'warning',
  },
  {
    id: 'banned',
    label: 'Banned',
    filter: (data) => data.filter(user => user.status === 'banned'),
    color: 'error',
  },
  {
    id: 'rejected',
    label: 'Rejected',
    filter: (data) => data.filter(user => user.status === 'rejected'),
    color: 'default',
  },
];

const searchConfig: SearchConfig<User> = {
  placeholder: 'Search users...',
  searchFields: ['name', 'email', 'company', 'role'],
  filterOptions: [
    {
      label: 'Role',
      value: 'role',
      options: ['Data Analyst', 'Business Consultant', 'Quality Assurance Tester', 'Marketing Strategist', 'IT Administrator'],
    },
  ],
};

const meta: Meta<typeof DataTable<User>> = {
  title: 'Data Display/Data Table',
  component: DataTable,
  decorators: [
    (Story) => (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Story />
      </Container>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# DataTable

A powerful data display component with built-in filtering, sorting, pagination, and actions.
Supports both legacy query functions and modern store-based data management.

## Store-Based Usage (Recommended)

\`\`\`tsx
import { createQueryStore, DataTable } from '@asyml8/ui';

// Create a store for your data
const usersStore = createQueryStore(['users']);

// Use in component
function UsersPage() {
  return (
    <DataTable
      store={usersStore}
      columns={columns}
      getRowId={(user) => user.id}
      filterTabs={filterTabs}
      searchConfig={searchConfig}
      labels={{
        search: 'Search users...',
        clear: 'Clear',
        resultsFound: 'Results Found',
        dense: 'Dense',
        rowsPerPage: 'Rows per page',
      }}
    />
  );
}
\`\`\`

## Legacy Usage (Still Supported)

\`\`\`tsx
<DataTable
  queryKey={['users']}
  queryFn={fetchUsers}
  columns={columns}
  getRowId={(user) => user.id}
/>
\`\`\`

## Column Configuration

\`\`\`tsx
const columns = [
  {
    id: 'name',
    label: 'Name',
    sortable: true,
    minWidth: 150, // Responsive sizing
    render: (_, user) => <UserNameCell user={user} />,
  },
  {
    id: 'email',
    label: 'Email',
    width: 200, // Fixed width
    maxWidth: 300, // Max width
  },
];
\`\`\`

## Filter Tabs

\`\`\`tsx
const filterTabs = [
  {
    id: 'all',
    label: 'All',
    filter: (data) => data,
    color: 'default',
  },
  {
    id: 'active',
    label: 'Active',
    filter: (data) => data.filter(user => user.status === 'active'),
    color: 'success',
  },
];
\`\`\`

## Benefits of Store Integration
- **Automatic Caching**: Data is cached and shared across components
- **Background Updates**: Data refreshes automatically based on stale time
- **Optimistic Updates**: UI updates immediately, syncs with server
- **Error Handling**: Built-in error states and retry logic
- **Type Safety**: Full TypeScript support with inferred types
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock store for stories
const createMockStore = (data: User[], loading = false) => ({
  useQuery: () => ({
    data,
    isLoading: loading,
    error: null,
    refetch: () => {},
  }),
});

const usersStore = createMockStore(mockUsers);
const loadingStore = createMockStore([], true);

export const Default: Story = {
  args: {
    store: usersStore,
    columns,
    getRowId: (user: User) => user.id,
    filterTabs,
    searchConfig,
    onRowSelect: (selectedIds: string[]) => console.log('Selected:', selectedIds),
    onRowClick: (user: User) => console.log('Clicked user:', user),
  },
};

export const WithoutFilters: Story = {
  args: {
    store: usersStore,
    columns,
    getRowId: (user: User) => user.id,
    onRowSelect: (selectedIds: string[]) => console.log('Selected:', selectedIds),
    onRowClick: (user: User) => console.log('Clicked user:', user),
  },
};

export const WithoutSelection: Story = {
  args: {
    store: usersStore,
    columns,
    getRowId: (user: User) => user.id,
    filterTabs,
    searchConfig,
    enableSelection: false,
    onRowClick: (user: User) => console.log('Clicked user:', user),
  },
};

export const Dense: Story = {
  args: {
    store: usersStore,
    columns,
    getRowId: (user: User) => user.id,
    filterTabs,
    searchConfig,
    enableDense: true,
    onRowSelect: (selectedIds: string[]) => console.log('Selected:', selectedIds),
    onRowClick: (user: User) => console.log('Clicked user:', user),
  },
};

export const Loading: Story = {
  args: {
    store: loadingStore,
    columns,
    getRowId: (user: User) => user.id,
    filterTabs,
    searchConfig,
    onRowSelect: (selectedIds: string[]) => console.log('Selected:', selectedIds),
    onRowClick: (user: User) => console.log('Clicked user:', user),
  },
};

export const WithLocalization: Story = {
  args: {
    store: usersStore,
    columns,
    getRowId: (user: User) => user.id,
    filterTabs,
    searchConfig,
    labels: {
      search: 'Buscar usuarios...',
      clear: 'Limpiar',
      resultsFound: 'Resultados Encontrados',
      dense: 'Compacto',
      rowsPerPage: 'Filas por página',
    },
    onRowSelect: (selectedIds: string[]) => console.log('Selected:', selectedIds),
    onRowClick: (user: User) => console.log('Clicked user:', user),
  },
  parameters: {
    docs: {
      description: {
        story: 'DataTable with Spanish localization. All interface text is translated including search placeholder, buttons, and pagination labels. Use the `labels` prop to provide translations for your application.',
      },
    },
  },
};
