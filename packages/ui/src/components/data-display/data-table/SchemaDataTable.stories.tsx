import type { Meta, StoryObj } from '@storybook/react-vite';
import { SchemaDataTable } from './schema-data-table';
import { Label } from '../label/label';
import { Iconify } from '../../iconify';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  avatar?: string;
  isActive: boolean;
  phone?: string;
  department?: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', createdAt: '2023-01-15', isActive: true, phone: '555-0101', department: 'IT' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', createdAt: '2023-02-20', isActive: true, phone: '555-0102', department: 'Marketing' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive', createdAt: '2023-03-10', isActive: false, phone: '555-0103', department: 'Sales' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'Active', createdAt: '2023-04-05', isActive: true, phone: '555-0104', department: 'HR' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'Pending', createdAt: '2023-05-12', isActive: false, phone: '555-0105', department: 'Finance' },
];

const userColumns = [
  {
    id: 'name' as keyof User,
    label: 'User',
    sortable: true,
    render: (_: any, user: User) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ 
          width: 40, 
          height: 40, 
          borderRadius: '50%', 
          backgroundColor: '#1976d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold'
        }}>
          {user.name.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: 500, fontSize: 14 }}>{user.name}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{user.email}</div>
        </div>
      </div>
    )
  },
  {
    id: 'role' as keyof User,
    label: 'Role',
    width: 120,
  },
  {
    id: 'department' as keyof User,
    label: 'Department',
    width: 120,
  },
  {
    id: 'status' as keyof User,
    label: 'Status',
    render: (_: any, user: User) => (
      <Label 
        color={user.status === 'Active' ? 'success' : user.status === 'Pending' ? 'warning' : 'error'}
        variant="soft"
      >
        {user.status}
      </Label>
    )
  },
  {
    id: 'isActive' as keyof User,
    label: 'Active',
    render: (_: any, user: User) => (
      <input 
        type="checkbox" 
        checked={user.isActive} 
        onChange={() => {}}
        style={{ transform: 'scale(1.2)' }}
      />
    )
  },
  {
    id: 'createdAt' as keyof User,
    label: 'Created Date',
    sortable: true,
    width: 140,
  }
];

const createMockDataStore = () => ({
  useQuery: (config?: any) => ({
    data: mockUsers,
    isLoading: false,
    error: null,
    refetch: () => {},
    totalCount: mockUsers.length,
  }),
});

const createMockSchemaStore = () => ({
  useQuery: () => ({
    columns: userColumns as any,
    filterTabs: [
      { id: 'all', label: 'All Users', filter: {} },
      { id: 'active', label: 'Active', filter: { status: ['Active'] } },
      { id: 'inactive', label: 'Inactive', filter: { status: ['Inactive', 'Pending'] } },
    ],
    searchConfig: {
      placeholder: 'Search users by name or email...',
      searchableFields: ['name', 'email'],
    },
    actions: [
      { id: 'edit', label: 'Edit User', icon: 'solar:pen-bold' },
      { id: 'delete', label: 'Delete User', icon: 'solar:trash-bin-trash-bold' },
      { id: 'view', label: 'View Details', icon: 'solar:eye-bold' },
    ],
    isLoading: false,
    error: null,
  }),
});

const meta: Meta<typeof SchemaDataTable> = {
  title: 'Data Display/Data Table/Schema',
  component: SchemaDataTable,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    dataStore: createMockDataStore() as any,
    schemaStore: createMockSchemaStore() as any,
    getRowId: (row: any) => row.id,
    enableSelection: true,
    enableDense: true,
    title: 'Data Display/Data Table/Schema',
  },
};

export const WithFiltersAndSearch: Story = {
  args: {
    dataStore: createMockDataStore() as any,
    schemaStore: createMockSchemaStore() as any,
    getRowId: (row: any) => row.id,
    enableSelection: true,
    enableDense: true,
    title: 'Data Display/Data Table/Schema',
  },
};

export const CompactView: Story = {
  args: {
    dataStore: createMockDataStore() as any,
    schemaStore: createMockSchemaStore() as any,
    getRowId: (row: any) => row.id,
    enableSelection: false,
    enableDense: false,
    title: 'Data Display/Data Table/Schema',
  },
};

export const LoadingState: Story = {
  args: {
    dataStore: {
      useQuery: () => ({
        data: [],
        isLoading: true,
        error: null,
        refetch: () => {},
        totalCount: 0,
      }),
    } as any,
    schemaStore: createMockSchemaStore() as any,
    getRowId: (row: any) => row.id,
    enableSelection: true,
    enableDense: true,
    title: 'Data Display/Data Table/Schema',
  },
};
