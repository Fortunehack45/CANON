import { z } from "zod";
import type { BlackBoxClient } from "../client.js";

export const getFileDecisionsTool = {
  name: "get_file_decisions",
  description:
    "Get all engineering decisions related to a specific file or directory. " +
    "Use this when opening a file to understand its history, or when the engineer " +
    "asks about a specific module, service, or component. Returns decisions that " +
    "affected this file, sorted by recency.",
  inputSchema: {
    type: "object",
    properties: {
      filePath: {
        type: "string",
        description:
          "Relative file path from repo root. Examples: " +
          "'src/services/payment.ts', " +
          "'apps/api/src/auth/' (directory), " +
          "'prisma/schema.prisma'"
      }
    },
    required: ["filePath"]
  }
};

const InputSchema = z.object({
  filePath: z.string().min(1).max(500)
});

export async function handleGetFileDecisions(
  client: BlackBoxClient,
  args: unknown
) {
  const { filePath } = InputSchema.parse(args);
  const records = await client.getFileDecisions(filePath);

  if (records.length === 0) {
    return {
      content: [{
        type: "text",
        text: `No recorded decisions found for ${filePath}.`
      }]
    };
  }

  const lines: string[] = [
    `DECISIONS AFFECTING ${filePath} (${records.length} found):`,
    ""
  ];

  for (const record of records) {
    lines.push(`[${record.impact.toUpperCase()}] ${record.title}`);
    lines.push(`Date:   ${new Date(record.createdAt).toLocaleDateString()}`);
    lines.push(`Author: ${record.authorGithubLogin ?? "unknown"}`);
    if (record.summaryOneLiner) lines.push(`Summary: ${record.summaryOneLiner}`);
    if (record.why)             lines.push(`Why:     ${record.why}`);
    if (record.linkedPrNumber)  lines.push(`PR: #${record.linkedPrNumber}`);
    lines.push("");
  }

  return {
    content: [{ type: "text", text: lines.join("\n") }]
  };
}
