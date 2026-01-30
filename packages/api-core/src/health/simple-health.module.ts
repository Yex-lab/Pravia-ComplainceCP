import { Module } from '@nestjs/common';
import { SimpleHealthService } from './simple-health.service';
import { SimpleHealthController } from './simple-health.controller';

@Module({
  controllers: [SimpleHealthController],
  providers: [SimpleHealthService],
  exports: [SimpleHealthService],
})
export class SimpleHealthModule {}
