import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { searchDecisionsTool, handleSearchDecisions } from "./tools/search.js";
import { getFileDecisionsTool, handleGetFileDecisions } from "./tools/file.js";
import { checkConflictsTool, handleCheckConflicts } from "./tools/conflicts.js";
import { getRecentDecisionsTool, handleGetRecentDecisions } from "./tools/recent.js";
import { BlackBoxClient } from "./client.js";

const API_KEY = process.env.BLACKBOX_API_KEY;
const API_URL = process.env.BLACKBOX_API_URL || "http://localhost:3001";

if (!API_KEY) {
  process.stderr.write(
    "Error: BLACKBOX_API_KEY environment variable is required.\n" +
    "Get your API key at https://app.blackbox.dev/settings/api-keys\n"
  );
  process.exit(1);
}

const client = new BlackBoxClient(API_KEY, API_URL);

const server = new Server(
  { name: "blackbox", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    searchDecisionsTool,
    getFileDecisionsTool,
    checkConflictsTool,
    getRecentDecisionsTool,
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "search_decisions":
        return await handleSearchDecisions(client, args);
      case "get_file_decisions":
        return await handleGetFileDecisions(client, args);
      case "check_conflicts":
        return await handleCheckConflicts(client, args);
      case "get_recent_decisions":
        return await handleGetRecentDecisions(client, args);
      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true
        };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      content: [{ type: "text", text: `Black Box error: ${message}` }],
      isError: true
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write("Black Box MCP server running\n");
}

main().catch(err => {
  process.stderr.write(`Fatal error: ${err.message}\n`);
  process.exit(1);
});
