import { BaseService } from '@asyml8/ui';
import { authApi } from 'src/lib/api-setup';
import { mock{{entityPlural}}, getMock{{entityPlural}}, getMock{{name}} } from 'src/_mock/{{kebabName}}.mock';

export interface {{Name}}Data {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  // Add your specific fields here
}

export interface Create{{Name}}Dto {
  name: string;
  // Add your create fields here
}

export interface Update{{Name}}Dto {
  name?: string;
  // Add your update fields here
}

// Toggle between mock and real API
const USE_MOCK_DATA = true; // Set to false when API is ready

export class {{Name}}Service extends BaseService {
  constructor() {
    super(authApi);
  }

  async list{{entityPlural}}(): Promise<{{Name}}Data[]> {
    if (USE_MOCK_DATA) {
      return getMock{{entityPlural}}();
    }
    return this.list<{{Name}}Data[]>('{{apiEndpoint}}/{{entityPlural}}');
  }

  async get{{Name}}(id: string): Promise<{{Name}}Data> {
    if (USE_MOCK_DATA) {
      const mock = await getMock{{Name}}(id);
      if (!mock) throw new Error('{{Name}} not found');
      return mock;
    }
    return this.get<{{Name}}Data>(`{{apiEndpoint}}/{{entityPlural}}/${id}`);
  }

  async create{{Name}}(data: Create{{Name}}Dto): Promise<{{Name}}Data> {
    if (USE_MOCK_DATA) {
      const newItem: {{Name}}Data = {
        id: Date.now().toString(),
        name: data.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mock{{entityPlural}}.push(newItem);
      return newItem;
    }
    return this.post<{{Name}}Data>('{{apiEndpoint}}/{{entityPlural}}', data);
  }

  async update{{Name}}(id: string, data: Update{{Name}}Dto): Promise<{{Name}}Data> {
    if (USE_MOCK_DATA) {
      const index = mock{{entityPlural}}.findIndex(item => item.id === id);
      if (index === -1) throw new Error('{{Name}} not found');
      
      mock{{entityPlural}}[index] = {
        ...mock{{entityPlural}}[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return mock{{entityPlural}}[index];
    }
    return this.put<{{Name}}Data>(`{{apiEndpoint}}/{{entityPlural}}/${id}`, data);
  }

  async delete{{Name}}(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      const index = mock{{entityPlural}}.findIndex(item => item.id === id);
      if (index === -1) throw new Error('{{Name}} not found');
      mock{{entityPlural}}.splice(index, 1);
      return;
    }
    return this.delete(`{{apiEndpoint}}/{{entityPlural}}/${id}`);
  }
}

export const {{name}}Service = new {{Name}}Service();
