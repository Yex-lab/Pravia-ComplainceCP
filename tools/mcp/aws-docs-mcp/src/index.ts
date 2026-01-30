#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

const server = new Server(
  {
    name: 'aws-docs-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_aws_docs',
        description: 'Search AWS official documentation',
        inputSchema: {
          type: 'object',
          properties: {
            service: {
              type: 'string',
              description: 'AWS service (e.g., rds, secretsmanager, ecs)',
            },
            query: {
              type: 'string',
              description: 'Search query',
            },
          },
          required: ['service', 'query'],
        },
      },
      {
        name: 'get_aws_doc_page',
        description: 'Get specific AWS documentation page',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'AWS documentation URL',
            },
          },
          required: ['url'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_aws_docs': {
        const { service, query } = args as { service: string; query: string };
        
        // Search AWS docs using Google site search
        const searchUrl = `https://www.google.com/search?q=site:docs.aws.amazon.com+${service}+${encodeURIComponent(query)}`;
        
        const response = await axios.get(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; AWS-Docs-MCP/1.0)',
          },
        });

        const $ = cheerio.load(response.data);
        const results: Array<{ title: string; url: string; snippet: string }> = [];

        $('div.g').each((_, element) => {
          const titleEl = $(element).find('h3').first();
          const linkEl = $(element).find('a').first();
          const snippetEl = $(element).find('.VwiC3b').first();

          const title = titleEl.text().trim();
          const url = linkEl.attr('href');
          const snippet = snippetEl.text().trim();

          if (title && url && url.includes('docs.aws.amazon.com')) {
            results.push({ title, url, snippet });
          }
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results.slice(0, 5), null, 2),
            },
          ],
        };
      }

      case 'get_aws_doc_page': {
        const { url } = args as { url: string };
        
        if (!url.includes('docs.aws.amazon.com')) {
          throw new Error('URL must be from docs.aws.amazon.com');
        }

        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; AWS-Docs-MCP/1.0)',
          },
        });

        const $ = cheerio.load(response.data);
        
        // Extract main content
        const content = $('.main-col-body, .awsui-util-container, main').first();
        const text = content.text().replace(/\s+/g, ' ').trim();

        return {
          content: [
            {
              type: 'text',
              text: text.substring(0, 8000), // Limit response size
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
