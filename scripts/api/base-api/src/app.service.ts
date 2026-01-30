import { readFileSync } from 'fs';
import { join } from 'path';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppInfo() {
    // When running from dist, __dirname is dist/src, so go up two levels
    const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
    return {
      name: 'Pravia Incidents API',
      description: 'Incidents Data Management API for Pravia ecosystem',
      version: packageJson.version,
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
