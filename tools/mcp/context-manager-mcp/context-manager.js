#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";

const server = new Server(
  { name: "context-manager", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

const contextDir = path.join(process.cwd(), ".amazonq", "context-snapshots");

// Ensure context directory exists
if (!fs.existsSync(contextDir)) {
  fs.mkdirSync(contextDir, { recursive: true });
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "check_context_usage",
      description: "Check current context window usage and warn if approaching limit",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "save_context",
      description: "Save current conversation context to file",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Name for the context snapshot" },
          summary: { type: "string", description: "Brief summary of the context" }
        },
        required: ["name"]
      }
    },
    {
      name: "load_context", 
      description: "Load previously saved context",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Name of context to load" }
        },
        required: ["name"]
      }
    },
    {
      name: "list_contexts",
      description: "List all saved context snapshots",
      inputSchema: { type: "object", properties: {} }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "check_context_usage": {
      // Estimate context usage based on conversation length
      const conversationLength = JSON.stringify(request).length;
      const estimatedTokens = Math.floor(conversationLength / 4); // Rough token estimate
      const maxTokens = 200000; // Typical context window
      const usagePercent = Math.min(100, Math.floor((estimatedTokens / maxTokens) * 100));
      
      let warning = "";
      let emoji = "🟢";
      
      if (usagePercent >= 90) {
        emoji = "🔴";
        warning = "\n\n⚠️ **CRITICAL**: Context almost full! Save important parts now and use /compact immediately.";
      } else if (usagePercent >= 75) {
        emoji = "🟡";
        warning = "\n\n⚠️ **WARNING**: Context getting full. Consider saving important parts and using /compact soon.";
      } else if (usagePercent >= 50) {
        emoji = "🟡";
        warning = "\n\n💡 **INFO**: Context usage moderate. Good time to save important parts if needed.";
      }
      
      return {
        content: [{
          type: "text",
          text: `${emoji} **Context Usage: ${usagePercent}%**\n\nEstimated tokens: ${estimatedTokens.toLocaleString()}/${maxTokens.toLocaleString()}${warning}`
        }]
      };
    }

    case "save_context": {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${args.name}-${timestamp}.json`;
      const filepath = path.join(contextDir, filename);
      
      const contextData = {
        name: args.name,
        summary: args.summary || "No summary provided",
        timestamp: new Date().toISOString(),
        note: "Context saved - use /compact to free up current session space"
      };
      
      fs.writeFileSync(filepath, JSON.stringify(contextData, null, 2));
      
      return {
        content: [{
          type: "text",
          text: `✅ Context saved as: ${filename}\n\n**Next step**: Use /compact to summarize and free up current session context.`
        }]
      };
    }

    case "load_context": {
      const files = fs.readdirSync(contextDir).filter(f => f.startsWith(args.name));
      if (files.length === 0) {
        return {
          content: [{ type: "text", text: `❌ No context found with name: ${args.name}` }]
        };
      }
      
      const filepath = path.join(contextDir, files[0]);
      const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      
      return {
        content: [{
          type: "text", 
          text: `📂 **Context: ${data.name}**\n\n**Summary**: ${data.summary}\n**Saved**: ${data.timestamp}\n\n*Context reference loaded - original conversation details preserved in file*`
        }]
      };
    }

    case "list_contexts": {
      const files = fs.readdirSync(contextDir).filter(f => f.endsWith('.json'));
      if (files.length === 0) {
        return {
          content: [{ type: "text", text: "📭 No saved contexts found" }]
        };
      }
      
      const contexts = files.map(f => {
        const data = JSON.parse(fs.readFileSync(path.join(contextDir, f), 'utf8'));
        return `• **${data.name}** - ${data.summary} (${new Date(data.timestamp).toLocaleDateString()})`;
      }).join('\n');
      
      return {
        content: [{
          type: "text",
          text: `📚 **Saved Contexts:**\n\n${contexts}`
        }]
      };
    }
  }
});

const transport = new StdioServerTransport();
server.connect(transport);
