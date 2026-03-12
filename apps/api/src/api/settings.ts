import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/authenticate.js';
import { encrypt, decrypt } from '../lib/crypto.js';

export const settingsRouter = Router();
settingsRouter.use(authenticate);

// GET /api/settings
settingsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const org = await prisma.organization.findUnique({ where: { id: req.user!.orgId } });
    if (!org) return res.status(404).json({ error: 'Org not found' });
    // Redact sensitive fields
    const { slackBotToken, jiraToken, ...safe } = org;
    res.json({ ...safe, slackConnected: !!slackBotToken, jiraConnected: !!jiraToken });
  } catch {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PATCH /api/settings
settingsRouter.patch('/', async (req: Request, res: Response) => {
  try {
    const { orgId } = req.user!;
    const { slackBotToken, jiraToken, ...rest } = req.body;

    const updateData: Record<string, unknown> = { ...rest };
    if (slackBotToken) updateData.slackBotToken = encrypt(slackBotToken);
    if (jiraToken) updateData.jiraToken = encrypt(jiraToken);

    const updated = await prisma.organization.update({ where: { id: orgId }, data: updateData });
    const { slackBotToken: _s, jiraToken: _j, ...safe } = updated;
    res.json(safe);
  } catch {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});
