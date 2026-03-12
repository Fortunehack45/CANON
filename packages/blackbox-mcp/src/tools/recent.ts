import { z } from "zod";
import type { BlackBoxClient } from "../client.js";

export const getRecentDecisionsTool = {
  name: "get_recent_decisions",
  description:
    "Get the most recent engineering decisions across the organization. " +
    "Use this at the start of a session to orient the AI with recent changes, " +
    "when the engineer asks what has changed recently, or to provide context " +
    "about current team direction and priorities.",
  inputSchema: {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Number of recent decisions to retrieve (default: 10, max: 20)",
        default: 10
      },
      decisionType: {
        type: "string",
        description: "Optional filter by type: architecture, performance, security, " +
                     "dependency, data_model, api_contract, infrastructure",
      }
    }
  }
};

const InputSchema = z.object({
  limit: z.number().int().min(1).max(20).default(10),
  decisionType: z.string().optional()
});

export async function handleGetRecentDecisions(
  client: BlackBoxClient,
  args: unknown
) {
  const { limit, decisionType } = InputSchema.parse(args ?? {});
  const records = await client.getRecentDecisions(limit);

  const filtered = decisionType
    ? records.filter(r => r.decisionType === decisionType)
    : records;

  if (filtered.length === 0) {
    return {
      content: [{ type: "text", text: "No recent decisions found." }]
    };
  }

  const lines: string[] = [
    `RECENT DECISIONS (last ${filtered.length}):`,
    ""
  ];

  for (const record of filtered) {
    lines.push(`[${record.impact.toUpperCase()} / ${record.decisionType}] ${record.title}`);
    lines.push(`Date:   ${new Date(record.createdAt).toLocaleDateString()}`);
    lines.push(`Author: ${record.authorGithubLogin ?? "unknown"}`);
    if (record.summaryOneLiner) lines.push(record.summaryOneLiner);
    lines.push("");
  }

  return {
    content: [{ type: "text", text: lines.join("\n") }]
  };
}
