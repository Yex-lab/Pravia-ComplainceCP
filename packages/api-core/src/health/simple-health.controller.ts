import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SimpleHealthService } from './simple-health.service';

@ApiTags('Health')
@Controller('health')
export class SimpleHealthController {
  constructor(private readonly healthService: SimpleHealthService) {}

  @Get()
  @ApiOperation({ summary: 'Get overall system health' })
  @ApiResponse({ status: 200, description: 'System health status' })
  getHealth() {
    return this.healthService.getHealth();
  }

  @Get('memory')
  @ApiOperation({ summary: 'Get memory health' })
  @ApiResponse({ status: 200, description: 'Memory health status' })
  getMemoryHealth() {
    return this.healthService.getMemoryHealth();
  }
}
