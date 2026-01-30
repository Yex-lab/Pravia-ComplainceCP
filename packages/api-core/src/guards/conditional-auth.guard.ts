import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SupabaseAuthGuard } from '../modules/auth/supabase-auth.guard';
import { SupabaseService } from '../modules/auth/supabase.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ConditionalAuthGuard extends SupabaseAuthGuard {
  private readonly authDisabled: boolean;

  constructor(
    @Inject(SupabaseService) supabaseService: SupabaseService,
    private reflector: Reflector,
  ) {
    super(supabaseService);
    this.authDisabled = process.env.DISABLE_AUTH === 'true';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if endpoint is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic || this.authDisabled) {
      return true;
    }

    return super.canActivate(context);
  }
}
