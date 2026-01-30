#!/usr/bin/env tsx

import { APIGenerator } from '../generator';

async function main() {
  const generator = new APIGenerator();
  
  const options = {
    projectName: 'pravia-data-api',
    apiTitle: 'Pravia Data API',
    description: 'Data Management API for Pravia ecosystem',
    port: 4001,
    databaseName: 'pravia_data',
    includeSupabase: true,
    includeAWS: true,
    includeRedis: true,
    swaggerPath: 'docs',
    healthEndpoints: true,
    outputDir: './pravia-data-api'
  };

  await generator.generate(options);
}

main().catch(console.error);
