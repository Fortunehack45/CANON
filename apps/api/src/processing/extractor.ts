import Anthropic from '@anthropic-ai/sdk';
import { AssembledContext } from '../capture/context-assembler.js';
import { logger } from '../lib/logger.js';

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const EXTRACTION_PROMPT = `You are an expert software engineering analyst. Extract structured engineering decisions from the provided PR data.

A DECISION exists when code changes reveal a deliberate choice between alternatives — architectural patterns, library selections, performance tradeoffs, security approaches, data model design, API contracts, or infrastructure choices.

NOT every PR contains a decision. Dependency bumps, typo fixes, test additions, and formatting changes rarely contain decisions.

Analyze:
- The code diff (what actually changed)
- PR title and description
- Review comments
- Linked ticket context

Return a JSON object:
{
  "isDecision": boolean,
  "title": "Verb-first title under 80 chars",
  "summaryOneLiner": "One sentence, plain English",
  "what": "What technically changed",
  "why": "The reason — the most important field. Why this over alternatives?",
  "alternativesConsidered": ["array", "of", "alternatives"],
  "tradeoffs": "What was accepted or given up",
  "decisionType": "architecture|performance|security|dependency|data_model|api_contract|infrastructure|refactor|bugfix|feature",
  "impact": "critical|high|medium|low",
  "tags": ["relevant", "tags"]
}

Return ONLY valid JSON. No markdown fences.`;

export interface ExtractionResult {
  isDecision: boolean;
  title: string;
  summaryOneLiner: string;
  what: string;
  why: string;
  alternativesConsidered: string[];
  tradeoffs: string;
  decisionType: string;
  impact: string;
  tags: string[];
}

export async function extractDecision(ctx: AssembledContext): Promise<ExtractionResult | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    logger.warn('No ANTHROPIC_API_KEY set, skipping extraction');
    return null;
  }

  const userMessage = `PR #${ctx.prNumber}: ${ctx.prTitle}

Description:
${ctx.prBody || 'No description provided'}

Diff (first 8000 chars):
${ctx.diff.diffContent}

Files changed: ${ctx.diff.filesChanged.join(', ')}
Additions: ${ctx.diff.additions}, Deletions: ${ctx.diff.deletions}`;

  try {
    const response = await claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: EXTRACTION_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const result = JSON.parse(text) as ExtractionResult;
    logger.info({ pr: ctx.prNumber, isDecision: result.isDecision }, 'Extraction complete');
    return result;
  } catch (err) {
    logger.error({ err, pr: ctx.prNumber }, 'Extraction failed');
    return null;
  }
}
