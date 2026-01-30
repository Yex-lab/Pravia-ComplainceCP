import { BaseService } from '@asyml8/ui';
import type { AxiosInstance } from 'axios';

export interface {{Name}}Data {
  id: string;
  // Add your data structure here
}

export class {{Name}}Service extends BaseService {
  constructor(httpClient: AxiosInstance) {
    super(httpClient);
  }

  async list{{Name}}s(): Promise<{{Name}}Data[]> {
    return this.list<{{Name}}Data[]>('{{apiEndpoint}}/{{name}}s');
  }

  async get{{Name}}(id: string): Promise<{{Name}}Data> {
    return this.get<{{Name}}Data>(`{{apiEndpoint}}/{{name}}s/${id}`);
  }

  async create{{Name}}(data: Omit<{{Name}}Data, 'id'>): Promise<{{Name}}Data> {
    return this.post<{{Name}}Data>('{{apiEndpoint}}/{{name}}s', data);
  }

  async update{{Name}}(id: string, data: Partial<{{Name}}Data>): Promise<{{Name}}Data> {
    return this.put<{{Name}}Data>(`{{apiEndpoint}}/{{name}}s/${id}`, data);
  }

  async delete{{Name}}(id: string): Promise<void> {
    return this.delete(`{{apiEndpoint}}/{{name}}s/${id}`);
  }
}

export const {{name}}Service = new {{Name}}Service(/* inject your http client */);
