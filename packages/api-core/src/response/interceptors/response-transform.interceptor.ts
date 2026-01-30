import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map, tap } from 'rxjs';
import { FastifyReply } from 'fastify';

import { getStatusDetails } from '../../constants/http-status';
import { EntityResponse, EntityListResponse } from '../dto/entity-response.dto';
import { ResponseMessageKey, ResponseAsStreamKey } from '../decorators/response.decorator';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, EntityResponse<T> | EntityListResponse<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<EntityResponse<T> | EntityListResponse<T>> {
    const responseMessage = this.reflector.get<string>(ResponseMessageKey, context.getHandler()) ?? '';
    const isResponseStream =
      this.reflector.get<boolean>(ResponseAsStreamKey, context.getHandler()) ?? false;

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse<FastifyReply>();

        if (isResponseStream) {
          res.header('Access-Control-Allow-Origin', '*');
          res.header('Content-Type', 'text/plain');
          res.header('Cache-Control', 'no-cache');
        } else {
          res.header('Content-Type', 'application/json');
          res.header('Access-Control-Allow-Origin', '*');
          res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.header('Access-Control-Allow-Credentials', 'true');
          res.header(
            'Access-Control-Allow-Headers',
            'authorizationToken,Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers,*',
          );
        }
      }),
      map((data: any) => {
        if (isResponseStream) {
          return data;
        }

        const statusCode = context.switchToHttp().getResponse().statusCode;
        const statusDetails = getStatusDetails(statusCode);
        const statusMessage = statusDetails?.message || 'Unknown';

        // Determine if response should be single entity or list
        const isArray = Array.isArray(data);

        if (isArray) {
          return new EntityListResponse(data, responseMessage, statusCode, statusMessage);
        } else {
          return new EntityResponse(data, responseMessage, statusCode, statusMessage);
        }
      }),
    );
  }
}
