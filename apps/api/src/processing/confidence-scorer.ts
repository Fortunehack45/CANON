import { ExtractionResult } from './extractor.js';
import { AssembledContext } from '../capture/context-assembler.js';

export interface ConfidenceFactors {
  hasPrDescription: boolean;
  hasDiff: boolean;
  hasMultipleFiles: boolean;
  isNonTrivialChange: boolean;
  hasAlternatives: boolean;
  hasReasoning: boolean;
}

export function scoreConfidence(
  extraction: ExtractionResult,
  ctx: AssembledContext
): number {
  let score = 0;

  // Data quality signals
  if (ctx.prBody && ctx.prBody.length > 50) score += 0.15;
  if (ctx.diff.diffContent.length > 100) score += 0.15;
  if (ctx.diff.filesChanged.length > 1) score += 0.10;
  if (ctx.diff.additions + ctx.diff.deletions > 20) score += 0.10;

  // Extraction quality signals
  if (extraction.why && extraction.why.length > 50) score += 0.20;
  if (extraction.alternativesConsidered.length > 0) score += 0.15;
  if (extraction.tradeoffs && extraction.tradeoffs.length > 20) score += 0.10;
  if (extraction.tags.length > 0) score += 0.05;

  // Impact modifier
  const impactBoost: Record<string, number> = { critical: 0.05, high: 0.03, medium: 0.01, low: 0 };
  score += impactBoost[extraction.impact] || 0;

  return Math.min(score, 1.0);
}

export function routeByConfidence(score: number): 'auto_approve' | 'soft_nudge' | 'active_nudge' | 'escalate' {
  if (score >= 0.90) return 'auto_approve';
  if (score >= 0.70) return 'soft_nudge';
  if (score >= 0.50) return 'active_nudge';
  return 'escalate';
}
