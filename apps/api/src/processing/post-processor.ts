import { ulid } from 'ulid';
import { prisma } from '../lib/prisma.js';
import { ExtractionResult } from './extractor.js';
import { AssembledContext } from '../capture/context-assembler.js';
import { logger } from '../lib/logger.js';

export interface PostProcessOptions {
  orgId: string;
  extraction: ExtractionResult;
  ctx: AssembledContext;
  confidence: number;
  route: string;
}

export async function postProcess(opts: PostProcessOptions): Promise<string> {
  const { orgId, extraction, ctx, confidence, route } = opts;

  const id = ulid();
  const status = route === 'auto_approve' ? 'confirmed' : 'pending_review';

  await prisma.decisionRecord.create({
    data: {
      id,
      orgId,
      title: extraction.title,
      summaryOneLiner: extraction.summaryOneLiner,
      what: extraction.what,
      why: extraction.why,
      alternativesConsidered: extraction.alternativesConsidered,
      tradeoffs: extraction.tradeoffs,
      decisionType: extraction.decisionType,
      impact: extraction.impact,
      tags: extraction.tags,
      confidence,
      aiModel: 'claude-sonnet-4-20250514',
      dataSources: ['github_pr', ctx.diff.filesChanged.length > 0 ? 'diff' : ''].filter(Boolean),
      status,
      authorGithubLogin: ctx.authorLogin,
      linkedPrNumber: ctx.prNumber,
      linkedRepo: ctx.repo,
      filesAffected: ctx.diff.filesChanged,
    },
  });

  logger.info({ id, orgId, status, confidence }, 'Decision record created');
  return id;
}
