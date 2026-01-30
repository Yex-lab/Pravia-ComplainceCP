import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interceptor to remove null and undefined values from response objects
 * Enabled by default, can be disabled with EXCLUDE_NULL_VALUES=false
 */
@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.removeNullValues(data)));
  }

  private removeNullValues(obj: any): any {
    if (obj === null || obj === undefined) {
      return undefined;
    }

    // Handle Date objects
    if (obj instanceof Date) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.removeNullValues(item)).filter((item) => item !== undefined);
    }

    if (typeof obj === 'object' && obj !== null) {
      const cleaned: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = this.removeNullValues(obj[key]);
          if (value !== undefined) {
            cleaned[key] = value;
          }
        }
      }
      return cleaned;
    }

    return obj;
  }
}
