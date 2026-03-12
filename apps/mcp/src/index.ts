#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';

// Requires BLACK_BOX_API_URL and BLACK_BOX_API_KEY environment variables
const API_URL = process.env.BLACK_BOX_API_URL || 'http://localhost:3001';
const API_KEY = process.env.BLACK_BOX_API_KEY;

if (!API_KEY) {
  console.error('BLACK_BOX_API_KEY environment variable is required');
  process.exit(1);
}

const server = new Server(
  {
    name: 'blackbox-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_decisions',
        description: 'Search the engineering knowledge base for past decisions, architectural context, or technical tradeoffs.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The topic, technology, or question to search for (e.g. "Redis vs Postgres", "authentication strategy")',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_decision_feed',
        description: 'Get the latest confirmed architectural decisions in the organization to understand recent changes.',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Number of decisions to return (default 5, max 20)',
            },
          },
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (request.params.name === 'search_decisions') {
      const query = request.params.arguments?.query as string;
      
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const answer = data.answer || 'No results found.';
      const sources = data.sources?.map((s: any) => `- ${s.title}: ${s.summaryOneLiner}`).join('\n') || '';

      return {
        content: [
          {
            type: 'text',
            text: `${answer}\n\nSources:\n${sources}`,
          },
        ],
      };
    }

    if (request.params.name === 'get_decision_feed') {
      const limit = (request.params.arguments?.limit as number) || 5;

      const response = await fetch(`${API_URL}/decisions?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      const text = data.data.map((d: any) => `
Title: ${d.title}
Status: ${d.status} | Impact: ${d.impact}
Summary: ${d.summaryOneLiner}
Why: ${d.why}
Tags: ${d.tags?.join(', ')}
---`).join('\n');

      return {
        content: [
          {
            type: 'text',
            text: text || 'No decisions found.',
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${request.params.name}`);
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing tool: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Black Box MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
