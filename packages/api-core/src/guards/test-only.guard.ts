import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

/**
 * Guard that only allows access when ENABLE_TEST_ENDPOINTS=true
 * Use this to protect endpoints that should only be available in test environments
 */
@Injectable()
export class TestOnlyGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    const envValue = process.env.ENABLE_TEST_ENDPOINTS;
    const isTestMode = envValue === 'true' || envValue === '1' || envValue === 'TRUE';

    if (!isTestMode) {
      throw new ForbiddenException('This endpoint is only available in test mode');
    }

    return true;
  }
}
