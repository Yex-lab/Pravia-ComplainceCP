import { Module } from '@nestjs/common';
import { ResponseTransformInterceptor } from './interceptors/response-transform.interceptor';

@Module({
  providers: [ResponseTransformInterceptor],
  exports: [ResponseTransformInterceptor],
})
export class ResponseModule {}
