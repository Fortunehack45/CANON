import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { logger } from '../../lib/logger.js';
import { prisma } from '../../lib/prisma.js';

export const slackWebhookRouter = Router();

function verifySlackSignature(req: Request): boolean {
  const secret = process.env.SLACK_SIGNING_SECRET;
  if (!secret) return true;
  const timestamp = req.headers['x-slack-request-timestamp'] as string;
  const slackSig = req.headers['x-slack-signature'] as string;
  if (!timestamp || !slackSig) return false;
  // Replay attack protection (5 min window)
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp)) > 300) return false;
  const baseStr = `v0:${timestamp}:${(req as any).rawBody || JSON.stringify(req.body)}`;
  const expected = 'v0=' + crypto.createHmac('sha256', secret).update(baseStr).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(slackSig), Buffer.from(expected));
}

// Slack URL verification + event handling
slackWebhookRouter.post('/', async (req: Request, res: Response) => {
  const { type, challenge, event, payload } = req.body;

  // URL verification challenge
  if (type === 'url_verification') {
    return res.json({ challenge });
  }

  if (!verifySlackSignature(req)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  logger.info({ type, eventType: event?.type }, 'Slack event received');

  // Handle interactive actions (button clicks from nudges)
  if (payload) {
    try {
      const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
      const { actions, team } = parsed;
      if (actions?.[0]) {
        const action = actions[0];
        const recordId = action.value;
        const actionType = action.action_id; // confirm, reject, edit

        const org = await prisma.organization.findFirst({
          where: { slackTeamId: team?.id },
        });

        if (org && recordId) {
          const statusMap: Record<string, string> = {
            confirm_decision: 'confirmed',
            reject_decision: 'rejected',
          };
          const newStatus = statusMap[actionType];
          if (newStatus) {
            await prisma.decisionRecord.updateMany({
              where: { id: recordId, orgId: org.id },
              data: { status: newStatus, confirmedAt: new Date() },
            });
            await prisma.pendingNudge.updateMany({
              where: { recordId, orgId: org.id },
              data: { status: 'responded', respondedAt: new Date() },
            });
          }
        }
      }
    } catch (err) {
      logger.error({ err }, 'Failed to handle Slack action');
    }
  }

  res.status(200).send();
});
