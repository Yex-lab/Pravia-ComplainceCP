import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [TypeOrmModule], // Import TypeOrmModule to access DataSource
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
