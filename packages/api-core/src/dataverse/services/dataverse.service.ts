import { Injectable, Logger } from '@nestjs/common';

import { DynamicsConfigService } from '../dynamics-config.service';
import { DataverseRecord } from '../types/dataverse.types';
import { IPlatformService, QueryOptions, BatchOperation, BatchResult } from '../../interfaces/platform.interface';

@Injectable()
export class DataverseService implements IPlatformService {
  private readonly logger = new Logger(DataverseService.name);

  constructor(private dynamicsConfig: DynamicsConfigService) {}

  async create<T>(entity: string, data: Partial<T>): Promise<T> {
    try {
      const result = await this.dynamicsConfig.getDynamicsWebApi().create({
        collection: entity,
        data: data,
        returnRepresentation: true,
      });
      return result as T;
    } catch (error) {
      this.logger.error(`Failed to create ${entity}:`, error);
      throw error;
    }
  }

  async read<T>(entity: string, id: string): Promise<T | null> {
    try {
      const result = await this.dynamicsConfig.getDynamicsWebApi().retrieve({
        collection: entity,
        key: id,
      });
      return result as T;
    } catch (error) {
      if (error.status === 404) return null;
      this.logger.error(`Failed to read ${entity} with id ${id}:`, error);
      throw error;
    }
  }

  async update<T>(entity: string, id: string, data: Partial<T>): Promise<T> {
    try {
      await this.dynamicsConfig.getDynamicsWebApi().update({
        collection: entity,
        key: id,
        data: data,
      });
      return this.read<T>(entity, id);
    } catch (error) {
      this.logger.error(`Failed to update ${entity} with id ${id}:`, error);
      throw error;
    }
  }

  async delete(entity: string, id: string): Promise<void> {
    try {
      await this.dynamicsConfig.getDynamicsWebApi().deleteRecord({
        collection: entity,
        key: id,
      });
    } catch (error) {
      this.logger.error(`Failed to delete ${entity} with id ${id}:`, error);
      throw error;
    }
  }

  async getCustomTables(): Promise<DataverseRecord[]> {
    try {
      this.logger.log('=== GET CUSTOM TABLES DEBUG ===');

      // Get all entities without any filtering
      const result = await this.dynamicsConfig.getDynamicsWebApi().retrieveMultiple({
        collection: 'EntityDefinitions',
        select: ['LogicalName'],
      });

      this.logger.log('Total entities:', result.value.length);
      return result.value.map((entity) => entity.LogicalName);
    } catch (error) {
      console.error('=== GET CUSTOM TABLES ERROR ===');
      console.error('Error details:', error);

      this.logger.error('Failed to get custom tables:', error);
      throw error;
    }
  }

  async getCustomViews(entityName?: string): Promise<DataverseRecord[]> {
    try {
      this.logger.log('=== GET CUSTOM VIEWS DEBUG ===');

      // Get all saved queries without filter first
      const result = await this.dynamicsConfig.getDynamicsWebApi().retrieveMultiple({
        collection: 'savedqueries',
        select: ['name', 'returnedtypecode'],
      });

      let views = result.value;

      // Filter by entity if provided
      if (entityName) {
        views = views.filter((v) => v.returnedtypecode === entityName);
      }

      // Filter for views with prvc_ or prv_ prefixes in the entity name
      views = views.filter(
        (v) =>
          v.returnedtypecode &&
          (v.returnedtypecode.includes('prvc_') || v.returnedtypecode.includes('prv_')),
      );

      this.logger.log('Total views:', result.value.length);
      this.logger.log('Filtered views:', views.length);
      return views;
    } catch (error) {
      console.error('=== GET CUSTOM VIEWS ERROR ===');
      console.error('Error details:', error);

      this.logger.error('Failed to get custom views:', error);
      throw error;
    }
  }

  async getAllEntities(): Promise<DataverseRecord[]> {
    try {
      this.logger.log('=== GET ALL ENTITIES DEBUG ===');

      // Remove all filters - just get basic entity list
      const result = await this.dynamicsConfig.getDynamicsWebApi().retrieveMultiple({
        collection: 'EntityDefinitions',
        select: ['LogicalName'],
      });

      this.logger.log('Total entities found:', result.value.length);
      return result.value.map((entity) => entity.LogicalName);
    } catch (error) {
      console.error('=== GET ALL ENTITIES ERROR ===');
      console.error('Error details:', error);

      this.logger.error('Failed to get all entities:', error);
      throw error;
    }
  }

  async query<T>(entity: string, options?: QueryOptions): Promise<T[]> {
    try {
      // DynamicsWebApi request object - dynamic structure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const request: any = {
        collection: entity,
      };

      if (options?.select) {
        request.select = Array.isArray(options.select) ? options.select : [options.select];
      }
      if (options?.filter) {
        request.filter = options.filter;
      }
      if (options?.top) request.top = options.top;

      const result = await this.dynamicsConfig.getDynamicsWebApi().retrieveMultiple(request);
      return result.value as T[];
    } catch (error) {
      this.logger.error(`Failed to query ${entity}:`, error);
      throw error;
    }
  }

  async batch(_operations: BatchOperation[]): Promise<BatchResult[]> {
    throw new Error('Batch operations not yet implemented');
  }
}
