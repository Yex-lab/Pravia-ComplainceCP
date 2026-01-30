import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Global()
@Module({})
export class LocalDatabaseModule {
  static forRoot(): DynamicModule {
    const isDatabaseEnabled = process.env.DATABASE_ENABLED !== 'false';

    if (!isDatabaseEnabled) {
      return {
        module: LocalDatabaseModule,
        imports: [],
        providers: [],
      };
    }

    return {
      module: LocalDatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DATABASE_HOST', 'localhost'),
            port: configService.get('DATABASE_PORT', 5432),
            username: configService.get('DATABASE_USERNAME', 'postgres'),
            password: configService.get('DATABASE_PASSWORD', 'postgres'),
            database: configService.get('DATABASE_DB_NAME', 'pravia_data'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false,
            logging: configService.get('NODE_ENV') === 'development',
            namingStrategy: new SnakeNamingStrategy(),
          }),
          inject: [ConfigService],
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
