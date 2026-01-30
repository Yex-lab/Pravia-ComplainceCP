import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

/**
 * Throttle module for rate limiting
 * Configures rate limiting based on environment variables
 */
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'public',
        ttl: parseInt(process.env.THROTTLE_PUBLIC_TTL || '60000', 10),
        limit: parseInt(process.env.THROTTLE_PUBLIC || '100', 10),
      },
      {
        name: 'protected',
        ttl: parseInt(process.env.THROTTLE_PROTECTED_TTL || '60000', 10),
        limit: parseInt(process.env.THROTTLE_PROTECTED || '1000', 10),
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [ThrottlerModule],
})
export class ApiThrottleModule {}
