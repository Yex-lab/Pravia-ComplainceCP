import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppInfo() {
    return {
      name: process.env.APP_TITLE || 'AI Foundation API',
      version: process.env.APP_VERSION || '1.0.0',
      description: process.env.APP_DESCRIPTION || 'Foundational AI services and intelligence API',
      timestamp: new Date().toISOString(),
    };
  }
}
