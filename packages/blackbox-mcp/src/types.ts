export interface DecisionRecord {
  id: string;
  title: string;
  summaryOneLiner?: string;
  what?: string;
  why?: string;
  alternativesConsidered: string[];
  tradeoffs?: string;
  decisionType: string;
  impact: string;
  authorGithubLogin?: string;
  linkedPrNumber?: number;
  linkedRepo?: string;
  createdAt: string;
}

export interface SearchResult {
  answer: string | null;
  confidence: 'high' | 'medium' | 'none';
  citations: DecisionRecord[];
}

export interface ConflictResult {
  hasConflicts: boolean;
  conflicts: {
    record: DecisionRecord;
    reason: string;
  }[];
}
