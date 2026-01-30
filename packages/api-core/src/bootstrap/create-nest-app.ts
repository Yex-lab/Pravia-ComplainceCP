import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerUI } from '../swagger';
import { ASCII_ART } from '../constants';
import { ExcludeNullInterceptor } from '../interceptors';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

export interface WavyGradientConfig {
  enabled?: boolean;
  colors?: string[];
  height?: string;
  waveHeight?: string;
}

export interface SwaggerConfig {
  topbarIconFilename?: string;
  persistAuthorization?: boolean;
  docProvider?: 'swagger' | 'redoc' | 'scalar' | 'all';
  wavyGradient?: WavyGradientConfig;
}

export interface AppConfig {
  title: string;
  description: string;
  version?: string;
  port?: number;
  apiPrefix?: string;
  serverName?: string;
  asciiArt?: string;
  swagger?: SwaggerConfig;
  autoIncrementVersion?: boolean;
  packageJsonPath?: string;
}

function getAndIncrementVersion(config: AppConfig): string {
  if (config.version) {
    return config.version;
  }

  const packageJsonPath = config.packageJsonPath || join(process.cwd(), 'package.json');
  
  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    let version = packageJson.version || '1.0.0';

    if (config.autoIncrementVersion) {
      const versionParts = version.split('.');
      const patch = parseInt(versionParts[2] || '0') + 1;
      version = `${versionParts[0]}.${versionParts[1]}.${patch}`;
      
      packageJson.version = version;
      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    }

    return version;
  } catch (error) {
    console.warn('Could not read package.json, using default version 1.0.0');
    return '1.0.0';
  }
}

export async function createNestApp(AppModule: any, config: AppConfig): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Apply null exclusion interceptor if enabled (default: true)
  const excludeNullValues = process.env.EXCLUDE_NULL_VALUES !== 'false';
  if (excludeNullValues) {
    app.useGlobalInterceptors(new ExcludeNullInterceptor());
  }

  const apiPrefix = config.apiPrefix || process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(apiPrefix);

  // Register Fastify CORS plugin for Fastify 5 compatibility
  await app.register(require('@fastify/cors'), {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Serve static files from the application's public directory
  const publicPath = join(process.cwd(), 'public');
  await app.register(require('@fastify/static'), {
    root: publicPath,
    prefix: '/',
  });

  await app.register(require('@fastify/multipart'), {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit for document uploads
    },
  });

  const version = getAndIncrementVersion(config);

  const swaggerConfig = new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description)
    .setVersion(version)
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter your JWT token',
      in: 'header',
    })
    .addTag('Application', 'Basic application information and metadata endpoints')
    .addTag('Health', 'System health monitoring endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  
  const port = config.port || process.env.PORT || 3000;
  const docProvider = config.swagger?.docProvider || 'swagger';
  
  // Register /api-json endpoint for all providers
  app.getHttpAdapter().get('/api-json', (req: any, res: any) => {
    res.send(document);
  });
  
  // Setup documentation based on provider choice
  if (docProvider === 'swagger' || docProvider === 'all') {
    const appUrl = process.env.APP_URL || `http://localhost:${port}`;
    const swaggerUI = new SwaggerUI(appUrl, {
      customSiteTitle: `${config.title} Documentation`,
      topbarIconFilename: config.swagger?.topbarIconFilename || 'logo.svg',
      persistAuthorization: config.swagger?.persistAuthorization ?? true,
      wavyGradient: {
        enabled: config.swagger?.wavyGradient?.enabled ?? true,
        colors: config.swagger?.wavyGradient?.colors || ['#E67E22', '#5DADE2', '#2E86AB'],
        height: config.swagger?.wavyGradient?.height || '60px',
        waveHeight: config.swagger?.wavyGradient?.waveHeight || '25px',
      },
    });
    SwaggerModule.setup('docs', app, document, swaggerUI.customOptions);
  }

  if (docProvider === 'redoc' || docProvider === 'all') {
    const redocHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${config.title} Documentation</title>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>body { margin: 0; padding: 0; }</style>
        </head>
        <body>
          <redoc spec-url='/api-json'></redoc>
          <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
        </body>
      </html>
    `;
    app.getHttpAdapter().get('/redoc', (req: any, res: any) => {
      res.type('text/html').send(redocHTML);
    });
  }

  if (docProvider === 'scalar' || docProvider === 'all') {
    const scalarHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${config.title} API Reference</title>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <script id="api-reference" data-url="/api-json"></script>
          <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
        </body>
      </html>
    `;
    app.getHttpAdapter().get('/scalar', (req: any, res: any) => {
      res.type('text/html').send(scalarHTML);
    });
  }

  await app.listen(port, '0.0.0.0');

  console.log(config.asciiArt || ASCII_ART.ASYML8);
  console.log(`🚀 ${config.serverName || 'Server'} v${version} running on http://localhost:${port}/api`);
  console.log(`📄 OpenAPI JSON: http://localhost:${port}/api-json`);
  
  // Log available documentation URLs
  if (docProvider === 'swagger' || docProvider === 'all') {
    console.log(`📚 Swagger docs: http://localhost:${port}/docs`);
  }
  if (docProvider === 'redoc' || docProvider === 'all') {
    console.log(`📖 ReDoc docs: http://localhost:${port}/redoc`);
  }
  if (docProvider === 'scalar' || docProvider === 'all') {
    console.log(`⚡ Scalar docs: http://localhost:${port}/scalar`);
  }
}
