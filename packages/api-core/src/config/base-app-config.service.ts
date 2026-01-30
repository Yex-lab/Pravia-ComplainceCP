import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BaseAppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('PORT', 4002);
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', 'default-secret');
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN', '24h');
  }

  get supabaseUrl(): string {
    return this.configService.get<string>('SUPABASE_URL', 'http://localhost:54321');
  }

  get supabaseAnonKey(): string {
    return this.configService.get<string>('SUPABASE_ANON_KEY', 'temp-disabled');
  }

  get supabaseServiceKey(): string {
    return this.configService.get<string>('SUPABASE_SERVICE_KEY') || '';
  }

  get maxFileSize(): number {
    return this.configService.get<number>('MAX_FILE_SIZE', 52428800);
  }

  get documentStoragePath(): string {
    return this.configService.get<string>('DOCUMENT_STORAGE_PATH', './uploads');
  }
}
