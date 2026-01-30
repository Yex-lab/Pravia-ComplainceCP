import {
  ResponseTransformInterceptor,
  SimpleHealthModule,
  AuthModule,
  ApiThrottleModule,
  ConditionalAuthGuard,
} from '@asyml8/api-core';
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocalDatabaseModule } from './database/database.module';
import { ValidatorsModule } from './modules/validators';

dotenv.config();
@Module({})
export class AppModule {
  static forRoot(): DynamicModule {
    const isDatabaseEnabled = process.env.DATABASE_ENABLED !== 'false';

    const imports = [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env',
      }),
      LoggerModule.forRoot({
        pinoHttp: {
          level: process.env.LOG_LEVEL || 'error',
          transport:
            process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local'
              ? { target: 'pino-pretty', options: { colorize: true } }
              : undefined,
        },
      }),
      SimpleHealthModule,
      AuthModule,
      ApiThrottleModule,
    ];

    if (isDatabaseEnabled) {
      imports.unshift(LocalDatabaseModule.forRoot());
      imports.push(ValidatorsModule);
    }

    return {
      module: AppModule,
      imports,
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: APP_INTERCEPTOR,
          useClass: ResponseTransformInterceptor,
        },
        {
          provide: APP_GUARD,
          useClass: ConditionalAuthGuard,
        },
      ],
    };
  }
}
