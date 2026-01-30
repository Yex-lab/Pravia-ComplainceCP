#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const API_DIR = './src/api';
const ROOT_INDEX = './src/index.ts';

console.log('📝 Creating root index file...');

const apiDirs = fs.readdirSync(API_DIR).filter(name => {
  const fullPath = path.join(API_DIR, name);
  return fs.statSync(fullPath).isDirectory();
});

let rootExports = [];
let apiVersions = [];

apiDirs.forEach(apiName => {
  const capitalName = apiName.charAt(0).toUpperCase() + apiName.slice(1);
  
  // Read swagger info for comments and version data
  const swaggerPath = path.join(API_DIR, apiName, 'swagger.json');
  let apiComment = '';
  if (fs.existsSync(swaggerPath)) {
    const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
    const { title, description, version } = swagger.info || {};
    apiComment = `\n// ${title || capitalName}\n// ${description || ''}`;
    
    // Read generated timestamp from API index
    const apiIndexPath = path.join(API_DIR, apiName, 'index.ts');
    let generatedAt = new Date().toISOString();
    if (fs.existsSync(apiIndexPath)) {
      const apiIndexContent = fs.readFileSync(apiIndexPath, 'utf-8');
      const match = apiIndexContent.match(/API_GENERATED_AT = '([^']+)'/);
      if (match) generatedAt = match[1];
    }
    
    // Collect version info
    apiVersions.push({
      name: apiName,
      version: version || 'unknown',
      title: title || capitalName,
      description: description || '',
      generatedAt,
    });
  }
  
  rootExports.push(apiComment);
  
  // Export types namespace
  rootExports.push(`export * as ${capitalName}Types from './api/${apiName}/types';`);
  
  // Export service factory
  const servicesDir = path.join(API_DIR, apiName, 'services');
  if (fs.existsSync(servicesDir)) {
    rootExports.push(`export { create${capitalName}Services } from './api/${apiName}/services';`);
    rootExports.push(`export type { ${capitalName}Services, ${capitalName}ServiceConfig } from './api/${apiName}/services';`);
  }
  
  // Export slice factory
  const slicesDir = path.join(API_DIR, apiName, 'slices');
  if (fs.existsSync(slicesDir)) {
    rootExports.push(`export { create${capitalName}Slices } from './api/${apiName}/slices';`);
    rootExports.push(`export type { ${capitalName}Slices } from './api/${apiName}/slices';`);
  }
});

const rootIndexContent = `/**
 * Auto-generated API types, services, and slices
 * DO NOT EDIT MANUALLY
 */

// Core interfaces
export * from './core';

${rootExports.join('\n')}

// API Version Information
export const API_VERSIONS = ${JSON.stringify(apiVersions, null, 2)} as const;
`;

fs.writeFileSync(ROOT_INDEX, rootIndexContent);

console.log('✅ Root index created!');
console.log(`📄 Exported ${apiDirs.length} APIs with barrel exports`);

