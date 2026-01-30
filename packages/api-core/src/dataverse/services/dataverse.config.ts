import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DataverseConfig {
  constructor(private configService: ConfigService) {}

  get url(): string {
    return this.configService.get<string>('DATAVERSE_URL');
  }

  get clientId(): string {
    return this.configService.get<string>('DATAVERSE_CLIENT_ID');
  }

  get clientSecret(): string {
    return this.configService.get<string>('DATAVERSE_CLIENT_SECRET');
  }

  get tenantId(): string {
    return this.configService.get<string>('DATAVERSE_TENANT_ID');
  }
}
