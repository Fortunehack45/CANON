import { z } from "zod";
import type { BlackBoxClient } from "../client.js";

export const searchDecisionsTool = {
  name: "search_decisions",
  description:
    "Search the engineering knowledge base for decisions, architectural choices, " +
    "and technical reasoning. Use this when you need to understand WHY something " +
    "was built a certain way, why a library or pattern was chosen, why a constraint " +
    "exists, or what alternatives were considered. Returns AI-synthesized answers " +
    "grounded in real Decision Records with citations.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description:
          "Natural language question or search terms. Examples: " +
          "'why do we use Redis for caching', " +
          "'circuit breaker payment service', " +
          "'authentication library choice'"
      },
      limit: {
        type: "number",
        description: "Max number of source records to retrieve (default: 5, max: 10)",
        default: 5
      }
    },
    required: ["query"]
  }
};

const InputSchema = z.object({
  query: z.string().min(1).max(500),
  limit: z.number().int().min(1).max(10).default(5)
});

export async function handleSearchDecisions(
  client: BlackBoxClient,
  args: unknown
) {
  const { query, limit } = InputSchema.parse(args);
  const result = await client.searchDecisions(query, limit);

  const lines: string[] = [];

  if (result.answer && result.confidence !== "none") {
    lines.push(`ANSWER (confidence: ${result.confidence})`);
    lines.push(result.answer);
    lines.push("");
  }

  if (result.citations.length > 0) {
    lines.push(`SOURCE DECISIONS (${result.citations.length} found):`);
    lines.push("");

    for (const record of result.citations) {
      lines.push(`--- Decision: ${record.title} ---`);
      lines.push(`ID:      ${record.id}`);
      lines.push(`Date:    ${new Date(record.createdAt).toLocaleDateString()}`);
      lines.push(`Author:  ${record.authorGithubLogin ?? "unknown"}`);
      lines.push(`Impact:  ${record.impact}`);
      lines.push(`Type:    ${record.decisionType}`);
      if (record.why)       lines.push(`Why:     ${record.why}`);
      if (record.what)      lines.push(`What:    ${record.what}`);
      if (record.tradeoffs) lines.push(`Tradeoffs: ${record.tradeoffs}`);
      if (record.alternativesConsidered?.length > 0) {
        lines.push(`Alternatives considered: ${record.alternativesConsidered.join(", ")}`);
      }
      if (record.linkedPrNumber) {
        lines.push(`Source PR: #${record.linkedPrNumber} in ${record.linkedRepo}`);
      }
      lines.push("");
    }
  } else {
    lines.push("No decisions found for this query.");
  }

  return {
    content: [{ type: "text", text: lines.join("\n") }]
  };
}
