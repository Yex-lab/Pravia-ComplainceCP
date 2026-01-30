#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ENV = process.argv[2] || 'dev';
const OUTPUT_DIR = './src/api';
const TEMP_DIR = './temp';

const ENVIRONMENTS = {
  dev: {
    flux: 'http://localhost:4001/docs-json',
    foundry: 'http://localhost:4000/docs-json',
    incidents: 'http://localhost:4006/docs-json',
  },
  qa: {
    flux: 'https://flux-qa.pravia.ca.gov/docs-json',
    foundry: 'https://foundry-qa.pravia.ca.gov/docs-json',
  },
  prod: {
    flux: 'https://flux.pravia.ca.gov/docs-json',
    foundry: 'https://foundry.pravia.ca.gov/docs-json',
  },
};

console.log('🔄 Generating API contracts from Swagger...');
console.log(`🌍 Environment: ${ENV}`);
console.log(`📁 Output: ${OUTPUT_DIR}\n`);

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

let generatedCount = 0;

function generateApi(apiName, url) {
  const outputDir = path.join(OUTPUT_DIR, apiName);
  
  console.log(`📡 ${apiName}`);
  console.log(`   Source: ${url}`);
  
  try {
    const tempFile = path.join(TEMP_DIR, `${apiName}.json`);
    execSync(`curl -sf "${url}" -o "${tempFile}"`, { stdio: 'pipe' });
    console.log('   ✅ Downloaded');
    
    const spec = JSON.parse(fs.readFileSync(tempFile, 'utf-8'));
    const version = spec.info.version;
    
    console.log(`   📦 Version: ${version}`);
    console.log('   🔨 Generating...');
    
    // Clean output directory only after successful download
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
    
    execSync(`npx swagger-typescript-api generate -p "${tempFile}" -o "${outputDir}" --modular --extract-enums --type-suffix "" --single-http-client --clean-output`, { stdio: 'pipe' });
    
    // Clean up API client files
    ['Api.ts', 'api.ts', 'ApiRoute.ts', 'api-route.ts', 'http-client.ts'].forEach(file => {
      const filePath = path.join(outputDir, file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
    
    // Rename to types.ts
    let contractsPath = path.join(outputDir, 'DataContracts.ts');
    if (!fs.existsSync(contractsPath)) {
      contractsPath = path.join(outputDir, 'data-contracts.ts');
    }
    if (fs.existsSync(contractsPath)) {
      fs.renameSync(contractsPath, path.join(outputDir, 'types.ts'));
    }
    
    // Save swagger spec for later use
    const generatedAt = new Date().toISOString();
    fs.writeFileSync(path.join(outputDir, 'swagger.json'), JSON.stringify(spec, null, 2));
    
    // Create API index (no barrel exports for subfolders)
    fs.writeFileSync(path.join(outputDir, 'index.ts'), 
`/**
 * ${apiName} API
 * @version ${version}
 * @generated ${generatedAt}
 */

export * as ${apiName}Types from './types';

export const API_VERSION = '${version}';
export const API_NAME = '${apiName}';
export const API_GENERATED_AT = '${generatedAt}';
`);
    
    generatedCount++;
    console.log(`   ✅ Generated: ${outputDir}`);
  } catch (error) {
    console.log('   ⚠️  Skipped - server did not return valid response (existing code preserved)');
  }
  
  console.log('');
}

const apis = ENVIRONMENTS[ENV];
if (!apis) {
  console.error(`❌ Unknown environment: ${ENV}`);
  console.error('Usage: node generate-from-swagger.js [dev|qa|prod]');
  process.exit(1);
}

Object.entries(apis).forEach(([name, url]) => generateApi(name, url));

// Create main api index
console.log('📝 Creating api index file...');
const apiDirs = fs.readdirSync(OUTPUT_DIR).filter(name => {
  const fullPath = path.join(OUTPUT_DIR, name);
  return fs.statSync(fullPath).isDirectory();
});

const apiIndexContent = `/**
 * Auto-generated API contracts
 * DO NOT EDIT MANUALLY
 * 
 * Note: This file intentionally left empty.
 * API exports are handled by the root index.ts
 */
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), apiIndexContent);

// Cleanup
if (fs.existsSync(TEMP_DIR)) {
  fs.rmSync(TEMP_DIR, { recursive: true });
}

console.log('✅ Contract generation complete!');
console.log(`📊 Generated: ${generatedCount} API(s)`);
console.log(`📄 Files in: ${OUTPUT_DIR}`);
