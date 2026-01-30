#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const GENERATED_DIR = path.join(__dirname, '../src/generated');
const COMMON_DIR = path.join(GENERATED_DIR, 'common');

// Find all data-contracts.ts files
function findDataContracts() {
  const apis = fs.readdirSync(GENERATED_DIR)
    .filter(name => {
      const fullPath = path.join(GENERATED_DIR, name);
      return fs.statSync(fullPath).isDirectory() && !name.startsWith('.');
    });
  
  return apis.map(api => ({
    api,
    path: path.join(GENERATED_DIR, api, 'data-contracts.ts')
  })).filter(({ path }) => fs.existsSync(path));
}

// Extract type definitions from file
function extractTypes(content) {
  const typeRegex = /export (?:interface|type|enum) (\w+)/g;
  const types = new Map();
  let match;
  
  while ((match = typeRegex.exec(content)) !== null) {
    const typeName = match[1];
    const typeStart = match.index;
    
    // Find the end of this type definition
    let braceCount = 0;
    let inType = false;
    let typeEnd = typeStart;
    
    for (let i = typeStart; i < content.length; i++) {
      const char = content[i];
      if (char === '{') {
        braceCount++;
        inType = true;
      } else if (char === '}') {
        braceCount--;
        if (inType && braceCount === 0) {
          typeEnd = i + 1;
          break;
        }
      } else if (char === ';' && !inType) {
        typeEnd = i + 1;
        break;
      }
    }
    
    const typeDefinition = content.substring(typeStart, typeEnd).trim();
    types.set(typeName, typeDefinition);
  }
  
  return types;
}

// Find duplicate types across APIs
function findDuplicates(apiTypes) {
  const typeOccurrences = new Map();
  
  apiTypes.forEach(({ api, types }) => {
    types.forEach((definition, typeName) => {
      if (!typeOccurrences.has(typeName)) {
        typeOccurrences.set(typeName, []);
      }
      typeOccurrences.get(typeName).push({ api, definition });
    });
  });
  
  // Find types that appear in multiple APIs with same definition
  const duplicates = new Map();
  
  typeOccurrences.forEach((occurrences, typeName) => {
    if (occurrences.length > 1) {
      // Check if definitions are identical
      const firstDef = occurrences[0].definition;
      const allSame = occurrences.every(({ definition }) => definition === firstDef);
      
      if (allSame) {
        duplicates.set(typeName, firstDef);
      }
    }
  });
  
  return duplicates;
}

// Main execution
console.log('🔍 Extracting common types...');

const dataContracts = findDataContracts();
console.log(`📄 Found ${dataContracts.length} API(s)`);

if (dataContracts.length < 2) {
  console.log('⏭️  Skipped (need at least 2 APIs to find common types)');
  process.exit(0);
}

// Extract types from each API
const apiTypes = dataContracts.map(({ api, path: filePath }) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const types = extractTypes(content);
  return { api, types, path: filePath };
});

// Find duplicates
const commonTypes = findDuplicates(apiTypes);

if (commonTypes.size === 0) {
  console.log('✅ No common types found');
  process.exit(0);
}

console.log(`📦 Found ${commonTypes.size} common type(s)`);

// Create common directory
if (!fs.existsSync(COMMON_DIR)) {
  fs.mkdirSync(COMMON_DIR, { recursive: true });
}

// Write common types file
const commonContent = `/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * Common types shared across multiple APIs
 * Auto-extracted from generated API types
 */

${Array.from(commonTypes.values()).join('\n\n')}
`;

fs.writeFileSync(path.join(COMMON_DIR, 'data-contracts.ts'), commonContent);

// Create index for common
fs.writeFileSync(
  path.join(COMMON_DIR, 'index.ts'),
  "export * from './data-contracts';\n"
);

// Update each API's data-contracts to import from common
apiTypes.forEach(({ api, path: filePath }) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Remove duplicate type definitions
  commonTypes.forEach((definition, typeName) => {
    content = content.replace(definition, '').trim();
  });
  
  // Add import for common types
  const importStatement = `import type { ${Array.from(commonTypes.keys()).join(', ')} } from '../common';\n\n`;
  
  // Find where to insert import (after existing comments)
  const firstExport = content.indexOf('export');
  if (firstExport !== -1) {
    content = content.substring(0, firstExport) + importStatement + content.substring(firstExport);
  }
  
  // Clean up multiple blank lines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  fs.writeFileSync(filePath, content);
  console.log(`   ✅ Updated ${api}/data-contracts.ts`);
});

// Update main index to export common
const mainIndexPath = path.join(GENERATED_DIR, 'index.ts');
let mainIndex = fs.readFileSync(mainIndexPath, 'utf-8');

if (!mainIndex.includes("export * from './common'")) {
  mainIndex = mainIndex.replace(
    'DO NOT EDIT MANUALLY\n */',
    "DO NOT EDIT MANUALLY\n */\n\nexport * from './common';"
  );
  fs.writeFileSync(mainIndexPath, mainIndex);
}

console.log('✅ Common types extracted successfully!');
console.log(`📁 Location: src/generated/common/`);
