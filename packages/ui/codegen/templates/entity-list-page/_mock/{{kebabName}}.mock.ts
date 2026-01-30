import type { {{Name}}Data } from 'src/services/{{kebabName}}.service';

// Mock data for {{Name}}
export const mock{{entityPlural}}: {{Name}}Data[] = [
  {
    id: '1',
    name: 'Sample {{Name}} 1',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
  },
  {
    id: '2', 
    name: 'Sample {{Name}} 2',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-21T16:20:00Z',
  },
  {
    id: '3',
    name: 'Sample {{Name}} 3', 
    createdAt: '2024-01-17T11:45:00Z',
    updatedAt: '2024-01-22T13:10:00Z',
  },
  {
    id: '4',
    name: 'Sample {{Name}} 4',
    createdAt: '2024-01-18T08:20:00Z',
    updatedAt: '2024-01-23T15:30:00Z',
  },
  {
    id: '5',
    name: 'Sample {{Name}} 5',
    createdAt: '2024-01-19T12:00:00Z',
    updatedAt: '2024-01-24T10:45:00Z',
  },
];

// Helper to get mock data with delay simulation
export const getMock{{entityPlural}} = async (delay = 500): Promise<{{Name}}Data[]> => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return mock{{entityPlural}};
};

export const getMock{{Name}} = async (id: string, delay = 300): Promise<{{Name}}Data | null> => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return mock{{entityPlural}}.find(item => item.id === id) || null;
};
