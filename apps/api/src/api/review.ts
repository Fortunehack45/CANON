import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/authenticate.js';
import { writeAuditLog } from '../lib/audit.js';

export const reviewRouter = Router();
reviewRouter.use(authenticate);

// GET /api/review - pending decisions
reviewRouter.get('/', async (req: Request, res: Response) => {
  try {
    const records = await prisma.decisionRecord.findMany({
      where: { orgId: req.user!.orgId, status: 'pending_review' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ data: records });
  } catch {
    res.status(500).json({ error: 'Failed to fetch review queue' });
  }
});

// POST /api/review/:id/confirm
reviewRouter.post('/:id/confirm', async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = { orgId: req.user!.orgId, userId: req.user!.userId };
    const record = await prisma.decisionRecord.findFirst({ where: { id: req.params.id, orgId } });
    if (!record) return res.status(404).json({ error: 'Not found' });

    const updated = await prisma.decisionRecord.update({
      where: { id: req.params.id },
      data: { status: 'confirmed', confirmedByUserId: userId, confirmedAt: new Date() },
    });
    await writeAuditLog({ orgId, actorId: userId, action: 'decision.confirmed', targetId: req.params.id });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to confirm decision' });
  }
});

// POST /api/review/:id/reject
reviewRouter.post('/:id/reject', async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = { orgId: req.user!.orgId, userId: req.user!.userId };
    const record = await prisma.decisionRecord.findFirst({ where: { id: req.params.id, orgId } });
    if (!record) return res.status(404).json({ error: 'Not found' });

    const updated = await prisma.decisionRecord.update({
      where: { id: req.params.id },
      data: { status: 'rejected', confirmedByUserId: userId, confirmedAt: new Date() },
    });
    await writeAuditLog({ orgId, actorId: userId, action: 'decision.rejected', targetId: req.params.id });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to reject decision' });
  }
});
