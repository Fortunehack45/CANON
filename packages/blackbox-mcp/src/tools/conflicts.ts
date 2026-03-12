import { z } from "zod";
import type { BlackBoxClient } from "../client.js";

export const checkConflictsTool = {
  name: "check_conflicts",
  description:
    "Check whether a proposed technical change conflicts with existing engineering " +
    "decisions. Use this BEFORE suggesting architectural changes, library replacements, " +
    "or major refactors to warn the engineer if the change contradicts a past decision. " +
    "Returns any conflicting decisions with their reasoning.",
  inputSchema: {
    type: "object",
    properties: {
      proposal: {
        type: "string",
        description:
          "Description of the proposed change. Be specific. Examples: " +
          "'replace Redis with in-memory cache', " +
          "'migrate from REST to GraphQL for the public API', " +
          "'switch ORM from Prisma to Drizzle'"
      }
    },
    required: ["proposal"]
  }
};

const InputSchema = z.object({
  proposal: z.string().min(1).max(1000)
});

export async function handleCheckConflicts(
  client: BlackBoxClient,
  args: unknown
) {
  const { proposal } = InputSchema.parse(args);
  const result = await client.checkConflicts(proposal);

  if (!result.hasConflicts) {
    return {
      content: [{
        type: "text",
        text: "No conflicts found."
      }]
    };
  }

  const lines: string[] = [
    `WARNING: ${result.conflicts.length} conflicting decision(s) found`,
    `Proposal: "${proposal}"`,
    ""
  ];

  for (const conflict of result.conflicts) {
    lines.push(`CONFLICT: ${conflict.record.title}`);
    lines.push(`Why this conflicts: ${conflict.reason}`);
    if (conflict.record.why) lines.push(`Original reasoning: ${conflict.record.why}`);
    lines.push("");
  }

  return {
    content: [{ type: "text", text: lines.join("\n") }]
  };
}
