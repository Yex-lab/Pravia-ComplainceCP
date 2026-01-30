import { createNestApp } from '@asyml8/api-core';
import { AppModule } from './app.module';

 
async function bootstrap() {
  const gradientColors = process.env.SWAGGER_GRADIENT_COLORS 
    ? process.env.SWAGGER_GRADIENT_COLORS.split(',').map(color => color.trim())
    : [];

  await createNestApp(AppModule, {
    title: process.env.APP_TITLE || 'AI Foundation API',
    description: process.env.APP_DESCRIPTION || 'Foundational AI services and intelligence API',
    serverName: process.env.SERVER_NAME || 'AI Foundation Server',
    autoIncrementVersion: true, // Commented out to test reading existing version
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
