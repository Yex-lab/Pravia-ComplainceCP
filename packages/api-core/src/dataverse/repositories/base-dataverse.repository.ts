import { Injectable, Logger, BadRequestException, ConflictException } from '@nestjs/common';
import { DynamicsWebApi } from 'dynamics-web-api';

import { EntityResponse, EntityListResponse } from '../../response/dto/entity-response.dto';
import { DynamicsConfigService } from '../dynamics-config.service';
import { QueryOptions } from '../types/dataverse.types';

@Injectable()
export abstract class BaseDataverseRepository<T> {
  protected readonly logger = new Logger(this.constructor.name);
  protected dynamicsWebApi: DynamicsWebApi;
  protected abstract entityName: string;

  constructor(protected dynamicsConfigService: DynamicsConfigService) {
    this.dynamicsWebApi = dynamicsConfigService.getDynamicsWebApi();
  }

  async create(data: Partial<T>): Promise<EntityResponse<T>> {
    try {
      const result = await this.dynamicsWebApi.create({
        collection: this.entityName,
        data: data,
        returnRepresentation: true,
      });
      return new EntityResponse(result as T, `${this.entityName} created successfully`);
    } catch (error) {
      this.logger.error(`Failed to create ${this.entityName}:`, error);
      this.handleDataverseError(error);
    }
  }

  protected handleDataverseError(error: Error): never {
    const message = error.message || 'An error occurred';

    // Handle duplicate key violations
    if (message.includes('Entity Key') && message.includes('violated')) {
      throw new ConflictException(message);
    }

    // Handle validation errors
    if (message.includes('required') || message.includes('invalid')) {
      throw new BadRequestException(message);
    }

    // Default to bad request for other errors
    throw new BadRequestException(message);
  }

  async findOne(id: string): Promise<EntityResponse<T | null>> {
    try {
      const result = await this.dynamicsWebApi.retrieve({
        collection: this.entityName,
        key: id,
      });
      return new EntityResponse(result, `${this.entityName} retrieved successfully`);
    } catch (error) {
      if (error.status === 404) {
        return new EntityResponse(null, `${this.entityName} not found`);
      }
      this.logger.error(`Failed to find ${this.entityName} with id ${id}:`, error);
      this.handleDataverseError(error);
    }
  }

  async update(id: string, data: Partial<T>): Promise<EntityResponse<T>> {
    try {
      await this.dynamicsWebApi.update({
        collection: this.entityName,
        key: id,
        data: data,
      });
      const updated = await this.findOne(id);
      return new EntityResponse(updated.body, `${this.entityName} updated successfully`);
    } catch (error) {
      this.logger.error(`Failed to update ${this.entityName} with id ${id}:`, error);
      this.handleDataverseError(error);
    }
  }

  async remove(id: string): Promise<EntityResponse<null>> {
    try {
      await this.dynamicsWebApi.deleteRecord({
        collection: this.entityName,
        key: id,
      });
      return new EntityResponse(null, `${this.entityName} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete ${this.entityName} with id ${id}:`, error);
      this.handleDataverseError(error);
    }
  }

  async findMany(options?: QueryOptions): Promise<EntityListResponse<T>> {
    try {
      if (!this.dynamicsWebApi) {
        throw new Error('Dynamics Web API is not initialized');
      }

      // DynamicsWebApi request object - dynamic structure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const request: any = { collection: this.entityName };

      if (options?.filter) request.filter = options.filter;
      if (options?.select) request.select = options.select;
      if (options?.orderBy) request.orderBy = [options.orderBy];
      if (options?.top) request.top = options.top;
      if (options?.skip) request.skip = options.skip;
      if (options?.expand) request.expand = options.expand;

      const result = await this.dynamicsWebApi.retrieveMultiple(request);
      return new EntityListResponse(result.value, `${this.entityName} list retrieved successfully`);
    } catch (error) {
      this.logger.error(`Failed to query ${this.entityName}:`, error);
      this.handleDataverseError(error);
    }
  }
}
