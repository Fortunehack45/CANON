import { Router, Request, Response } from 'express';
import { ulid } from 'ulid';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/authenticate.js';
import { writeAuditLog } from '../lib/audit.js';

export const decisionsRouter = Router();

decisionsRouter.use(authenticate);

// GET /api/decisions - list decisions for the org
decisionsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { status, type, impact, tag, q, page = '1', limit = '20' } = req.query;
    const orgId = req.user!.orgId;
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));

    const where: Record<string, unknown> = { orgId };
    if (status) where.status = String(status);
    if (type) where.decisionType = String(type);
    if (impact) where.impact = String(impact);
    if (tag) where.tags = { has: String(tag) };
    if (q) {
      where.OR = [
        { title: { contains: String(q), mode: 'insensitive' } },
        { summaryOneLiner: { contains: String(q), mode: 'insensitive' } },
      ];
    }

    const [records, total] = await Promise.all([
      prisma.decisionRecord.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(String(limit)),
      }),
      prisma.decisionRecord.count({ where }),
    ]);

    res.json({ data: records, meta: { total, page: parseInt(String(page)), limit: parseInt(String(limit)) } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch decisions' });
  }
});

// GET /api/decisions/:id
decisionsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const record = await prisma.decisionRecord.findFirst({
      where: { id: req.params.id, orgId: req.user!.orgId },
    });
    if (!record) return res.status(404).json({ error: 'Not found' });
    res.json(record);
  } catch {
    res.status(500).json({ error: 'Failed to fetch decision' });
  }
});

// PATCH /api/decisions/:id
decisionsRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = { orgId: req.user!.orgId, userId: req.user!.userId };
    const existing = await prisma.decisionRecord.findFirst({ where: { id: req.params.id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const editHistory = [...(existing.editHistory as unknown[]), { editedBy: userId, editedAt: new Date(), before: existing }];
    const updated = await prisma.decisionRecord.update({
      where: { id: req.params.id },
      data: { ...req.body, editHistory, updatedAt: new Date() },
    });

    await writeAuditLog({ orgId, actorId: userId, action: 'decision.updated', targetId: req.params.id });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update decision' });
  }
});

// DELETE /api/decisions/:id
decisionsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = { orgId: req.user!.orgId, userId: req.user!.userId };
    const existing = await prisma.decisionRecord.findFirst({ where: { id: req.params.id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Not found' });
    await prisma.decisionRecord.delete({ where: { id: req.params.id } });
    await writeAuditLog({ orgId, actorId: userId, action: 'decision.deleted', targetId: req.params.id });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete decision' });
  }
});
