#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { glob } from "glob";
import fs from "fs";
import path from "path";

const server = new Server(
  { name: "monorepo-compliance", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

const rootDir = process.cwd();

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "check_workspace_compliance",
      description: "Check all packages for compliance with monorepo standards",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "validate_dependencies",
      description: "Check for dependency version mismatches across packages",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "check_config_consistency",
      description: "Validate shared configs (ESLint, TypeScript, etc.) are consistent",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "analyze_package_boundaries",
      description: "Check for proper internal imports and circular dependencies",
      inputSchema: { type: "object", properties: {} }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;

  switch (name) {
    case "check_workspace_compliance": {
      const packages = await findPackages();
      const issues = [];
      
      for (const pkg of packages) {
        const pkgJson = JSON.parse(fs.readFileSync(pkg.packageJsonPath, 'utf8'));
        
        // Check required fields
        if (!pkgJson.name) issues.push(`${pkg.name}: Missing package name`);
        if (!pkgJson.version) issues.push(`${pkg.name}: Missing version`);
        
        // Check build script consistency
        if (pkgJson.scripts?.build && !pkgJson.scripts.build.includes('tsc')) {
          issues.push(`${pkg.name}: Build script should use TypeScript compiler`);
        }
        
        // Check for consistent file structure (only for shared libraries)
        const needsEntryPoint = shouldHaveEntryPoint(pkg.name, pkg.path);
        const hasIndex = fs.existsSync(path.join(pkg.path, 'src', 'index.ts'));
        if (needsEntryPoint && !hasIndex) {
          issues.push(`${pkg.name}: Missing src/index.ts entry point`);
        }
      }
      
      return {
        content: [{
          type: "text",
          text: issues.length === 0 
            ? `✅ **Workspace Compliance**: All ${packages.length} packages compliant`
            : `❌ **Compliance Issues Found:**\n\n${issues.map(i => `• ${i}`).join('\n')}`
        }]
      };
    }

    case "validate_dependencies": {
      const packages = await findPackages();
      const depMap = new Map();
      const issues = [];
      
      for (const pkg of packages) {
        const pkgJson = JSON.parse(fs.readFileSync(pkg.packageJsonPath, 'utf8'));
        const allDeps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
        
        for (const [dep, version] of Object.entries(allDeps)) {
          if (!depMap.has(dep)) depMap.set(dep, new Map());
          depMap.get(dep).set(pkg.name, version);
        }
      }
      
      for (const [dep, versions] of depMap) {
        const uniqueVersions = [...new Set(versions.values())];
        if (uniqueVersions.length > 1) {
          const versionList = [...versions.entries()]
            .map(([pkg, ver]) => `${pkg}: ${ver}`)
            .join(', ');
          issues.push(`**${dep}**: ${versionList}`);
        }
      }
      
      return {
        content: [{
          type: "text",
          text: issues.length === 0
            ? "✅ **Dependencies**: All versions aligned across packages"
            : `⚠️ **Version Mismatches:**\n\n${issues.join('\n\n')}`
        }]
      };
    }

    case "check_config_consistency": {
      const configs = ['tsconfig.json', '.eslintrc.json', '.prettierrc'];
      const issues = [];
      
      for (const config of configs) {
        const rootConfig = path.join(rootDir, config);
        if (!fs.existsSync(rootConfig)) {
          issues.push(`Missing root ${config}`);
          continue;
        }
        
        const packages = await findPackages();
        for (const pkg of packages) {
          const pkgConfig = path.join(pkg.path, config);
          if (fs.existsSync(pkgConfig)) {
            issues.push(`${pkg.name}: Has local ${config} (should extend root)`);
          }
        }
      }
      
      return {
        content: [{
          type: "text",
          text: issues.length === 0
            ? "✅ **Config Consistency**: All packages use shared configs"
            : `⚠️ **Config Issues:**\n\n${issues.map(i => `• ${i}`).join('\n')}`
        }]
      };
    }

    case "analyze_package_boundaries": {
      const packages = await findPackages();
      const issues = [];
      
      for (const pkg of packages) {
        const srcFiles = await glob(`${pkg.path}/src/**/*.{ts,tsx}`, { ignore: '**/*.d.ts' });
        
        for (const file of srcFiles) {
          const content = fs.readFileSync(file, 'utf8');
          const imports = content.match(/import.*from\s+['"]([^'"]+)['"]/g) || [];
          
          for (const imp of imports) {
            const match = imp.match(/from\s+['"]([^'"]+)['"]/);
            if (match) {
              const importPath = match[1];
              
              // Check for relative imports going outside package
              if (importPath.startsWith('../../../')) {
                issues.push(`${pkg.name}: ${path.basename(file)} has deep relative import: ${importPath}`);
              }
              
              // Check for direct file imports from other packages
              if (importPath.startsWith('@') && importPath.includes('/src/')) {
                issues.push(`${pkg.name}: ${path.basename(file)} imports internal file: ${importPath}`);
              }
            }
          }
        }
      }
      
      return {
        content: [{
          type: "text",
          text: issues.length === 0
            ? "✅ **Package Boundaries**: All imports follow proper boundaries"
            : `⚠️ **Boundary Violations:**\n\n${issues.map(i => `• ${i}`).join('\n')}`
        }]
      };
    }
  }
});

async function findPackages() {
  const packagePaths = await glob('**/package.json', { 
    ignore: ['**/node_modules/**', '**/dist/**'],
    cwd: rootDir 
  });
  
  return packagePaths
    .filter(p => p !== 'package.json') // Exclude root
    .map(p => {
      const fullPath = path.join(rootDir, p);
      const pkgDir = path.dirname(fullPath);
      const pkgJson = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      
      return {
        name: pkgJson.name || path.basename(pkgDir),
        path: pkgDir,
        packageJsonPath: fullPath
      };
    });
}

function shouldHaveEntryPoint(packageName, packagePath) {
  // Apps don't need entry points (they have their own structure)
  if (packagePath.includes('/apps/')) return false;
  
  // Infrastructure packages don't need entry points
  if (packagePath.includes('/infra/') || packageName.includes('-infra')) return false;
  
  // MCP servers don't need entry points (they're standalone)
  if (packagePath.includes('/mcp-servers/') || packageName.includes('-mcp')) return false;
  
  // Packages in /packages/ are shared libraries and need entry points
  if (packagePath.includes('/packages/')) return true;
  
  // Default to needing entry point for unknown package types
  return true;
}

const transport = new StdioServerTransport();
server.connect(transport);
