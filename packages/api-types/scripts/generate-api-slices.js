#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = './src/api';

function toPascalCase(str) {
  return str.replace(/(^\w|[-_]\w)/g, (match) => match.replace(/[-_]/, '').toUpperCase());
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toPlural(str) {
  if (str.endsWith('s')) return str;
  return str + 's';
}

function groupEndpointsByResource(paths) {
  const resources = {};
  
  Object.entries(paths).forEach(([path, methods]) => {
    const parts = path.split('/').filter(p => p && !p.startsWith('{'));
    if (parts.includes('health') || parts.includes('dev')) return;
    
    // Get tags from all methods in this path
    const tags = new Set();
    Object.values(methods).forEach(methodDef => {
      if (methodDef.tags && Array.isArray(methodDef.tags)) {
        methodDef.tags.forEach(tag => tags.add(tag));
      }
    });
    
    // Use first tag as resource name, fallback to path-based naming
    let resourceName;
    if (tags.size > 0) {
      // Convert tag to valid identifier: remove special chars, convert to kebab-case
      resourceName = Array.from(tags)[0]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
    } else {
      resourceName = parts[parts.length - 1];
    }
    
    if (!resources[resourceName]) {
      resources[resourceName] = { paths: {}, methods: new Set() };
    }
    
    resources[resourceName].paths[path] = methods;
    Object.keys(methods).forEach(method => resources[resourceName].methods.add(method));
  });
  
  return resources;
}

function generateSlice(resourceName, resource, types) {
  const pascalName = toPascalCase(resourceName);
  const camelName = toCamelCase(resourceName);
  const pluralCamel = resourceName.endsWith('s') ? camelName : toPlural(camelName);
  const pluralPascal = toPascalCase(pluralCamel);
  const methods = Array.from(resource.methods);
  
  // Only generate slice if resource has GET (list) operation
  if (!methods.includes('get')) return null;
  
  const dtos = types.filter(t => 
    t.toLowerCase().includes(resourceName.toLowerCase()) ||
    t.endsWith('Dto') || t.endsWith('ResponseDto')
  );
  
  const mainDto = dtos[0] || 'any';
  const listMethodName = pascalName.endsWith('s') ? pascalName : pascalName + 's';
  const singularPascal = pascalName.endsWith('s') && pascalName.length > 1 
    ? pascalName.slice(0, -1) 
    : pascalName;
  
  // Build mutations object
  let mutationsCode = '';
  const hasMutations = methods.includes('post') || methods.includes('put') || methods.includes('patch') || methods.includes('delete');
  
  if (hasMutations) {
    mutationsCode = '\n    mutations: {';
    
    if (methods.includes('post')) {
      mutationsCode += `\n      create: {
        mutationFn: (data: Partial<${mainDto}>) => service.create${singularPascal}(data),
      },`;
    }
    
    if (methods.includes('put') || methods.includes('patch')) {
      mutationsCode += `\n      update: {
        mutationFn: ({ id, data }: { id: string; data: Partial<${mainDto}> }) => 
          service.update${singularPascal}(id, data),
      },`;
    }
    
    if (methods.includes('delete')) {
      mutationsCode += `\n      delete: {
        mutationFn: (id: string) => service.delete${singularPascal}(id),
      },`;
    }
    
    mutationsCode += '\n    },';
  }
  
  return `import {
  createAppQuery,
  createQuerySlice,
  defaultQueryConfig,
  type QuerySliceState,
} from '../../../core';
import type { StateCreator } from 'zustand';

import type { ${mainDto} } from '../types';
import type { ResourceService } from '../../../core/api-services.interface';

export const create${pluralPascal}Slice = (service: ResourceService<${mainDto}>) => {
  const ${pluralCamel}Query = createAppQuery(['${pluralCamel}']);

  const ${pluralCamel}QueryConfig = {
    queryFn: () => service.list${listMethodName}(),
    ...defaultQueryConfig,
  };

  type ${pascalName}Filters = {
    searchQuery?: string;
  };

  type ${pluralPascal}Slice = QuerySliceState<${mainDto}, ${pascalName}Filters>;

  const create${pluralPascal}ZustandSlice: StateCreator<${pluralPascal}Slice> = createQuerySlice<
    ${mainDto},
    ${pascalName}Filters
  >({
    initialFilters: {
      searchQuery: '',
    },
  });

  return {
    query: ${pluralCamel}Query,
    queryConfig: ${pluralCamel}QueryConfig,${mutationsCode}
    createSlice: create${pluralPascal}ZustandSlice,
  };
};
`;
}

function extractTypes(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const typeMatches = content.matchAll(/export (?:interface|type) (\w+)/g);
  return Array.from(typeMatches, m => m[1]);
}

function main() {
  const apis = fs.readdirSync(OUTPUT_DIR).filter(name => {
    const fullPath = path.join(OUTPUT_DIR, name);
    return fs.statSync(fullPath).isDirectory();
  });

  let generatedCount = 0;

  apis.forEach(apiName => {
    const swaggerPath = path.join(OUTPUT_DIR, apiName, 'swagger.json');
    const typesPath = path.join(OUTPUT_DIR, apiName, 'types.ts');
    
    if (!fs.existsSync(swaggerPath) || !fs.existsSync(typesPath)) return;

    const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
    const types = extractTypes(typesPath);
    const resources = groupEndpointsByResource(swagger.paths);

    const slicesDir = path.join(OUTPUT_DIR, apiName, 'slices');
    if (!fs.existsSync(slicesDir)) fs.mkdirSync(slicesDir, { recursive: true });

    const generatedSlices = [];

    // Generate slice per resource (only if has GET)
    // Skip singular if plural version exists
    const resourceNames = Object.keys(resources);
    const pluralResources = new Set(resourceNames.filter(r => r.endsWith('s')));
    
    Object.entries(resources).forEach(([resourceName, resource]) => {
      // Skip if singular and plural exists (e.g., skip 'profile' if 'profiles' exists)
      if (!resourceName.endsWith('s') && pluralResources.has(resourceName + 's')) {
        return;
      }
      
      const sliceContent = generateSlice(resourceName, resource, types);
      if (sliceContent) {
        const fileName = `${resourceName}.slice.ts`;
        fs.writeFileSync(path.join(slicesDir, fileName), sliceContent);
        console.log(`✅ Generated: ${apiName}/slices/${fileName}`);
        generatedSlices.push(resourceName);
        generatedCount++;
      }
    });

    // Generate slices index with factory
    if (generatedSlices.length > 0) {
      const apiPascal = toPascalCase(apiName);
      const sortedSlices = generatedSlices.sort();
      
      const indexContent = `import type { ApiSlices } from '../../../core/api-slices.interface';
import type { ApiServices } from '../../../core/api-services.interface';

${sortedSlices.map(name => `export * from './${name}.slice';`).join('\n')}

${sortedSlices.map(name => {
  const pluralCamel = name.endsWith('s') ? toCamelCase(name) : toPlural(toCamelCase(name));
  const pluralPascal = toPascalCase(pluralCamel);
  return `import { create${pluralPascal}Slice } from './${name}.slice';`;
}).join('\n')}

export const create${apiPascal}Slices = (services: ApiServices): ApiSlices => ({
${sortedSlices.map(name => {
  const camelName = toCamelCase(name);
  const pluralCamel = name.endsWith('s') ? camelName : toPlural(camelName);
  const pluralPascal = toPascalCase(pluralCamel);
  return `  ${camelName}: create${pluralPascal}Slice(services.${camelName}),`;
}).join('\n')}
});

export type ${apiPascal}Slices = ReturnType<typeof create${apiPascal}Slices>;
`;
      fs.writeFileSync(path.join(slicesDir, 'index.ts'), indexContent);
    }
  });

  console.log(`\n✅ Slice generation complete! Generated ${generatedCount} slice(s)`);
}

main();
