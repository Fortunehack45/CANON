import fetch from "node-fetch";
import type { DecisionRecord, SearchResult, ConflictResult } from "./types.js";

export class BlackBoxClient {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string
  ) {}

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const { headers, body, ...rest } = options;
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...rest,
      body: (body as any) || undefined,
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "blackbox-mcp/1.0.0",
        ...(headers || {}),
      } as any
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Black Box API error ${response.status}: ${body}`);
    }

    const data = await response.json() as { success: boolean; data: T };
    return data.data;
  }

  async searchDecisions(query: string, limit = 5): Promise<SearchResult> {
    return this.request<SearchResult>("/api/v1/mcp/search", {
      method: "POST",
      body: JSON.stringify({ query, limit })
    });
  }

  async getFileDecisions(filePath: string): Promise<DecisionRecord[]> {
    const encoded = encodeURIComponent(filePath);
    return this.request<DecisionRecord[]>(`/api/v1/mcp/file?path=${encoded}`);
  }

  async checkConflicts(proposal: string): Promise<ConflictResult> {
    return this.request<ConflictResult>("/api/v1/mcp/conflicts", {
      method: "POST",
      body: JSON.stringify({ proposal })
    });
  }

  async getRecentDecisions(limit = 10): Promise<DecisionRecord[]> {
    return this.request<DecisionRecord[]>(`/api/v1/mcp/recent?limit=${limit}`);
  }
}
