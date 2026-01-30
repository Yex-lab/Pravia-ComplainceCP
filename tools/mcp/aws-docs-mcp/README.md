# AWS Documentation MCP Server

MCP server for accessing AWS official documentation.

## Tools

- `search_aws_docs`: Search AWS documentation by service and query
- `get_aws_doc_page`: Get content from specific AWS documentation page

## Setup

```bash
cd tools/aws-docs-mcp
npm install
npm run build
```

## Usage

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "aws-docs": {
      "command": "node",
      "args": ["./tools/aws-docs-mcp/dist/index.js"]
    }
  }
}
```
