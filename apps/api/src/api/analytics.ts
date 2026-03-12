import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/authenticate.js';

export const analyticsRouter = Router();
analyticsRouter.use(authenticate);

// GET /api/analytics - CTO overview stats
analyticsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const orgId = req.user!.orgId;

    const [total, confirmed, pending, byType, byImpact, recentDecisions] = await Promise.all([
      prisma.decisionRecord.count({ where: { orgId } }),
      prisma.decisionRecord.count({ where: { orgId, status: 'confirmed' } }),
      prisma.decisionRecord.count({ where: { orgId, status: 'pending_review' } }),
      prisma.decisionRecord.groupBy({ by: ['decisionType'], where: { orgId }, _count: true }),
      prisma.decisionRecord.groupBy({ by: ['impact'], where: { orgId }, _count: true }),
      prisma.decisionRecord.findMany({
        where: { orgId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, impact: true, decisionType: true, createdAt: true },
      }),
    ]);

    res.json({
      totals: { total, confirmed, pending, rejected: total - confirmed - pending },
      byType: Object.fromEntries(byType.map((r: any) => [r.decisionType, r._count])),
      byImpact: Object.fromEntries(byImpact.map((r: any) => [r.impact, r._count])),
      recentDecisions,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});
