import { logger } from '../lib/logger.js';
import { assembleContext } from '../capture/context-assembler.js';
import { extractDecision } from '../processing/extractor.js';
import { scoreConfidence, routeByConfidence } from '../processing/confidence-scorer.js';
import { postProcess } from '../processing/post-processor.js';
import { prisma } from '../lib/prisma.js';

interface ProcessPrOptions {
  prNumber: number;
  repo: string;
  installationId?: number;
  prTitle: string;
  prBody: string;
  authorLogin: string;
  mergedAt: string;
  diffUrl: string;
  orgId?: string;
}

export async function processPrJob(opts: ProcessPrOptions): Promise<void> {
  const { prNumber, repo, prTitle, prBody, authorLogin, mergedAt, diffUrl } = opts;

  logger.info({ prNumber, repo }, 'Starting PR processing job');

  // Lookup orgId and projectId from the repo mapping
  let orgId = opts.orgId;
  let projectId: string | undefined;

  const project = await prisma.project.findFirst({
    where: {
      githubRepoOwner: repo.split('/')[0],
      githubRepoName: repo.split('/')[1]
    }
  });

  if (project) {
    projectId = project.id;
    orgId = project.orgId;
  } else if (!orgId) {
    const repoOwner = repo.split('/')[0];
    const org = await prisma.organization.findFirst({ where: { githubOrgLogin: repoOwner } });
    orgId = org?.id;
  }

  if (!orgId) {
    logger.warn({ repo }, 'No org found for repo, skipping');
    return;
  }

  try {
    const ctx = await assembleContext({ prNumber, repo, prTitle, prBody, authorLogin, mergedAt, diffUrl });

    // Skip trivial changes
    if (ctx.diff.category === 'chore' && ctx.diff.additions < 10) {
      logger.info({ prNumber }, 'Trivial change skipped');
      return;
    }

    const extraction = await extractDecision(ctx);
    if (!extraction || !extraction.isDecision) {
      logger.info({ prNumber }, 'No decision detected');
      return;
    }

    const confidence = scoreConfidence(extraction, ctx);
    const route = routeByConfidence(confidence);

    const recordId = await postProcess({ orgId, projectId, extraction, ctx, confidence, route });

    logger.info({ prNumber, recordId, projectId, route, confidence }, 'PR processing complete');
  } catch (err) {
    logger.error({ err, prNumber }, 'PR processing failed');
  }
}
