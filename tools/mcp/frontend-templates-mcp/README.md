# Frontend Templates MCP Server

This directory contains a Model Context Protocol (MCP) server that extends Amazon Q CLI with frontend template functionality.

## Q CLI Configuration

The MCP server is configured in `~/.q/config.json`:

```json
{
  "mcpServers": {
    "frontend-templates": {
      "command": "node",
      "args": ["./tools/frontend-templates-mcp/frontend-templates-mcp.js"],
      "env": {}
    }
  }
}
```

## How MCP Works

Model Context Protocol (MCP) is an open standard that allows applications to provide additional context and tools to LLMs:

- **MCP Servers**: Local processes that provide tools, resources, and prompts
- **Q CLI Integration**: Automatically connects to configured servers on startup
- **Tool Extension**: Servers expose custom functions that Q can invoke
- **Resource Access**: Servers can provide access to local files, databases, APIs

## Adding More MCP Servers

To add additional MCP servers, extend the `mcpServers` object in your config:

```json
{
  "mcpServers": {
    "frontend-templates": {
      "command": "node",
      "args": ["./tools/frontend-templates-mcp/frontend-templates-mcp.js"],
      "env": {}
    },
    "database-tools": {
      "command": "python",
      "args": ["-m", "database_mcp_server"],
      "env": {
        "DB_CONNECTION": "postgresql://localhost:5432/mydb"
      }
    },
    "api-client": {
      "command": "./bin/api-mcp-server",
      "args": ["--port", "3000"],
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

## Server Configuration Options

- **command**: Executable to run the server (node, python, binary path)
- **args**: Command line arguments passed to the server
- **env**: Environment variables for the server process

## Extending This Server

To add functionality to the frontend-templates server:

1. Edit `frontend-templates-mcp.js`
2. Add new tool definitions using MCP SDK
3. Implement tool handlers
4. Restart Q CLI to reload the server

## Starting the MCP Server

After configuration, start a new Q CLI session to load the MCP server:

```bash
q chat
```

The MCP server will automatically start when Q CLI initializes. You'll see the frontend-templates tools become available in your session.

## Usage

Once configured, Q CLI automatically loads the MCP server and makes its tools available. Use Q CLI normally - the additional tools will be invoked when relevant to your requests.
