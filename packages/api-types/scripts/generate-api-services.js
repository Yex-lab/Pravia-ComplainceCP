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

function groupEndpointsByResource(paths) {
  const resources = {};
  
  Object.entries(paths).forEach(([path, methods]) => {
    // Skip health/dev endpoints
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
      // Fallback to last non-param segment
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

function generateMethodName(path, method) {
  // Remove leading /api and split path
  const cleanPath = path.replace(/^\/api\//, '');
  const segments = cleanPath.split('/').filter(p => p);
  
  // Build method name from path segments
  const pathParts = segments
    .map(seg => {
      // Keep param names but remove braces: {id} -> Id
      if (seg.startsWith('{') && seg.endsWith('}')) {
        return 'By' + toPascalCase(seg.slice(1, -1));
      }
      return toPascalCase(seg);
    })
    .join('');
  
  // Prefix with HTTP method
  const methodPrefix = method === 'get' ? 'get' : 
                       method === 'post' ? 'create' :
                       method === 'put' || method === 'patch' ? 'update' :
                       method === 'delete' ? 'delete' : method;
  
  return methodPrefix + pathParts;
}

function extractPathParams(path) {
  const params = [];
  const regex = /\{([^}]+)\}/g;
  let match;
  while ((match = regex.exec(path)) !== null) {
    params.push(match[1]);
  }
  return params;
}

function getResponseType(methodDef, types) {
  const responses = methodDef.responses;
  const successResponse = responses['200'] || responses['201'];
  
  if (!successResponse?.content?.['application/json']?.schema) {
    return 'any';
  }
  
  const schema = successResponse.content['application/json'].schema;
  
  // Handle allOf with EntityResponse pattern
  if (schema.allOf) {
    const bodyProperty = schema.allOf.find(item => item.properties?.body);
    if (bodyProperty?.properties?.body) {
      const bodySchema = bodyProperty.properties.body;
      
      // Handle direct $ref
      if (bodySchema.$ref) {
        const refType = bodySchema.$ref.split('/').pop();
        if (refType === 'Object') return 'object';
        return types.includes(refType) ? refType : 'any';
      }
      
      // Handle array with items.$ref
      if (bodySchema.type === 'array' && bodySchema.items?.$ref) {
        const refType = bodySchema.items.$ref.split('/').pop();
        if (refType === 'Object') return 'object';
        return types.includes(refType) ? refType : 'any';
      }
    }
  }
  
  // Handle direct $ref
  if (schema.$ref) {
    const refType = schema.$ref.split('/').pop();
    if (refType === 'Object') return 'object';
    return types.includes(refType) ? refType : 'any';
  }
  
  return 'any';
}

function generateService(resourceName, resource, types, apiName) {
  const pascalName = toPascalCase(resourceName);
  
  let serviceCode = `import type { createHttpHelpers } from '../../../core/http-helpers';
import type { ${types.filter(t => t.endsWith('Dto')).join(', ')} } from '../types';

export const create${pascalName}Service = (http: ReturnType<typeof createHttpHelpers>, basePath: string) => {
  return {
`;

  // Generate a method for each endpoint
  const endpoints = [];
  Object.entries(resource.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, methodDef]) => {
      if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
        endpoints.push({ path, method, methodDef });
      }
    });
  });

  endpoints.forEach(({ path, method, methodDef }) => {
    const methodName = generateMethodName(path, method);
    const pathParams = extractPathParams(path);
    const hasBody = ['post', 'put', 'patch'].includes(method);
    
    // Get actual response type from Swagger spec
    const responseType = getResponseType(methodDef, types);
    
    // Build parameter list
    const params = [];
    pathParams.forEach(param => {
      params.push(`${param}: string`);
    });
    if (hasBody) {
      // Get request body type from Swagger spec
      const requestBodySchema = methodDef.requestBody?.content?.['application/json']?.schema;
      let bodyType = 'any';
      if (requestBodySchema?.$ref) {
        const refType = requestBodySchema.$ref.split('/').pop();
        bodyType = types.includes(refType) ? refType : 'any';
      }
      params.push(`data: ${bodyType}`);
    }
    
    // Build return type
    const returnType = method === 'delete' ? 'void' : responseType;
    const isArray = method === 'get' && pathParams.length === 0;
    const fullReturnType = isArray ? `${returnType}[]` : returnType;
    
    // Build path template
    let pathTemplate = path;
    pathParams.forEach(param => {
      pathTemplate = pathTemplate.replace(`{${param}}`, `\${${param}}`);
    });
    
    // Build method call
    const httpMethod = method === 'patch' ? 'put' : method;
    const args = hasBody ? ', data' : '';
    
    serviceCode += `    ${methodName}: (${params.join(', ')}): Promise<${fullReturnType}> => 
      http.${httpMethod}(\`\${basePath}${pathTemplate}\`${args}),

`;
  });
  
  serviceCode += `  };
};
`;

  return serviceCode;
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

    const servicesDir = path.join(OUTPUT_DIR, apiName, 'services');
    if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir, { recursive: true });

    // Generate service per resource
    Object.entries(resources).forEach(([resourceName, resource]) => {
      const serviceContent = generateService(resourceName, resource, types, apiName);
      const fileName = `${resourceName}.service.ts`;
      fs.writeFileSync(path.join(servicesDir, fileName), serviceContent);
      console.log(`✅ Generated: ${apiName}/services/${fileName}`);
      generatedCount++;
    });

    // Generate services index with factory
    const resourceNames = Object.keys(resources).sort();
    const apiPascal = toPascalCase(apiName);
    
    const indexContent = `import type { AxiosInstance } from 'axios';
import type { ApiServices } from '../../../core/api-services.interface';
import { createHttpHelpers } from '../../../core/http-helpers';

${resourceNames.map(name => `export * from './${name}.service';`).join('\n')}

${resourceNames.map(name => {
  const pascalName = toPascalCase(name);
  return `import { create${pascalName}Service } from './${name}.service';`;
}).join('\n')}

export interface ${apiPascal}ServiceConfig {
  axios: AxiosInstance;
  basePath?: string;
}

export const create${apiPascal}Services = (config: ${apiPascal}ServiceConfig): ApiServices => {
  const { axios, basePath = '/api' } = config;
  const http = createHttpHelpers(axios);
  
  return {
${resourceNames.map(name => {
  const camelName = toCamelCase(name);
  const pascalName = toPascalCase(name);
  return `    ${camelName}: create${pascalName}Service(http, basePath),`;
}).join('\n')}
  };
};

export type ${apiPascal}Services = ReturnType<typeof create${apiPascal}Services>;
`;
    fs.writeFileSync(path.join(servicesDir, 'index.ts'), indexContent);
  });

  console.log(`\n✅ Service generation complete! Generated ${generatedCount} service(s)`);
}

main();
