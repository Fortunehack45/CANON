import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { logger } from '../../lib/logger.js';

export const githubWebhookRouter = Router();

// Use raw body for signature verification
githubWebhookRouter.use(
  (req: Request, res: Response, next: Function): void => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      (req as any).rawBody = data;
      try {
        req.body = JSON.parse(data);
      } catch {
        req.body = {};
      }
      next();
    });
  }
);

function verifyGithubSignature(req: Request): boolean {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) return true; // Skip in dev if not configured
  const signature = req.headers['x-hub-signature-256'] as string;
  if (!signature) return false;
  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update((req as any).rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

githubWebhookRouter.post('/', async (req: Request, res: Response) => {
  if (!verifyGithubSignature(req)) {
    logger.warn('Invalid GitHub webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.headers['x-github-event'] as string;
  const { action, pull_request, installation } = req.body;

  logger.info({ event, action }, 'GitHub webhook received');

  // Only process merged PRs
  if (event === 'pull_request' && action === 'closed' && pull_request?.merged) {
    const { processPrJob } = await import('../../jobs/process-pr.js');
    await processPrJob({
      prNumber: pull_request.number,
      repo: pull_request.base.repo.full_name,
      installationId: installation?.id,
      prTitle: pull_request.title,
      prBody: pull_request.body,
      authorLogin: pull_request.user?.login,
      mergedAt: pull_request.merged_at,
      diffUrl: pull_request.diff_url,
    });
    logger.info({ pr: pull_request.number }, 'PR processing job queued');
  }

  res.status(200).json({ received: true });
});
