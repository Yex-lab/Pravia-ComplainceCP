import { readFileSync } from 'fs';
import { join } from 'path';

import { createNestApp } from '@asyml8/api-core';

import { AppModule } from './app.module';

async function bootstrap() {
  // When running from dist, __dirname is dist (flat structure), so go up one level
  const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
  const { version } = packageJson;

  const gradientColors = process.env.SWAGGER_GRADIENT_COLORS
    ? process.env.SWAGGER_GRADIENT_COLORS.split(',').map((color) => color.trim())
    : ['#E67E22', '#5DADE2', '#2E86AB'];

  // TODO: Add rate limiting via NestJS guard instead of Fastify plugin
  // Rate limiting will be implemented using @Throttle() decorator from api-core

  await createNestApp(AppModule.forRoot(), {
    title: process.env.APP_TITLE || '{{APP_TITLE}}',
    description:
      process.env.APP_DESCRIPTION ||
      '{{API_DESCRIPTION}}',
    serverName: process.env.SERVER_NAME || '{{SERVER_NAME}}',
    version,
    autoIncrementVersion: true,
    swagger: {
      topbarIconFilename: process.env.SWAGGER_ICON_FILENAME || 'logo.svg',
      persistAuthorization: process.env.SWAGGER_PERSIST_AUTH === 'true',
      wavyGradient: {
        enabled: process.env.SWAGGER_GRADIENT_ENABLED === 'true',
        colors: gradientColors,
        height: process.env.SWAGGER_GRADIENT_HEIGHT || '60px',
        waveHeight: process.env.SWAGGER_WAVE_HEIGHT || '25px',
      },
    },
  });
}

bootstrap().catch(console.error);
