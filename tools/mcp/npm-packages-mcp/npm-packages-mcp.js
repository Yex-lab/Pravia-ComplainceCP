#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { execSync } from "child_process";

function logToQCLI(message) {
  console.error(`[MCP NPM Packages] ${new Date().toISOString()}: ${message}`);
}

const server = new Server(
  { name: "npm-packages-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_latest_package_version",
        description: "Get the latest version of an npm package",
        inputSchema: {
          type: "object",
          properties: {
            package: { type: "string", description: "Package name (e.g., react, @nestjs/core)" }
          },
          required: ["package"]
        }
      },
      {
        name: "get_package_info",
        description: "Get detailed package information including versions, dependencies",
        inputSchema: {
          type: "object",
          properties: {
            package: { type: "string", description: "Package name" }
          },
          required: ["package"]
        }
      },
      {
        name: "check_framework_versions",
        description: "Check latest versions for common frameworks (nestjs, react, fastify, etc.)",
        inputSchema: {
          type: "object",
          properties: {
            framework: { 
              type: "string", 
              description: "Framework name",
              enum: ["nestjs", "react", "fastify", "express", "mui", "nextjs", "all"]
            }
          },
          required: []
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case "get_latest_package_version":
        return await getLatestVersion(args.package);
      case "get_package_info":
        return await getPackageInfo(args.package);
      case "check_framework_versions":
        return await checkFrameworkVersions(args.framework || "all");
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }]
    };
  }
});

async function getLatestVersion(packageName) {
  try {
    const result = execSync(`npm view ${packageName} version`, { encoding: 'utf8' }).trim();
    return {
      content: [{ 
        type: "text", 
        text: `**${packageName}**: ${result}\n\nFetched: ${new Date().toISOString()}` 
      }]
    };
  } catch (error) {
    throw new Error(`Package not found: ${packageName}`);
  }
}

async function getPackageInfo(packageName) {
  try {
    const info = execSync(`npm view ${packageName} --json`, { encoding: 'utf8' });
    const data = JSON.parse(info);
    
    const output = `# ${data.name}
**Version**: ${data.version}
**Description**: ${data.description}
**License**: ${data.license}
**Dependencies**: ${Object.keys(data.dependencies || {}).length}
**Last Updated**: ${data.time?.modified || 'N/A'}
**Homepage**: ${data.homepage || 'N/A'}`;

    return {
      content: [{ type: "text", text: output }]
    };
  } catch (error) {
    throw new Error(`Failed to get info for: ${packageName}`);
  }
}

async function checkFrameworkVersions(framework) {
  const frameworks = {
    nestjs: ["@nestjs/core", "@nestjs/common", "@nestjs/platform-express"],
    react: ["react", "react-dom", "@types/react"],
    fastify: ["fastify", "@fastify/cors", "@fastify/static"],
    express: ["express", "@types/express", "cors"],
    mui: ["@mui/material", "@mui/icons-material", "@emotion/react"],
    nextjs: ["next", "@next/bundle-analyzer"]
  };

  let packages = [];
  if (framework === "all") {
    packages = Object.values(frameworks).flat();
  } else if (frameworks[framework]) {
    packages = frameworks[framework];
  } else {
    throw new Error(`Unknown framework: ${framework}`);
  }

  let output = `# Latest Package Versions\n\n`;
  
  for (const pkg of packages) {
    try {
      const version = execSync(`npm view ${pkg} version`, { encoding: 'utf8' }).trim();
      output += `**${pkg}**: ${version}\n`;
    } catch (error) {
      output += `**${pkg}**: ❌ Not found\n`;
    }
  }
  
  output += `\n*Fetched: ${new Date().toISOString()}*`;

  return {
    content: [{ type: "text", text: output }]
  };
}

async function main() {
  logToQCLI("Starting NPM Packages MCP Server");
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(error => {
  logToQCLI(`Fatal error: ${error.message}`);
  process.exit(1);
});
