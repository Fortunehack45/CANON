import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/authenticate.js';

export const queryRouter = Router();
queryRouter.use(authenticate);

// POST /api/query - semantic search
queryRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { q, limit = 10 } = req.body;
    if (!q) return res.status(400).json({ error: 'Query is required' });

    // Full-text search via PostgreSQL (vector search added in Step 7)
    const records = await prisma.decisionRecord.findMany({
      where: {
        orgId: req.user!.orgId,
        status: 'confirmed',
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { why: { contains: q, mode: 'insensitive' } },
          { what: { contains: q, mode: 'insensitive' } },
          { summaryOneLiner: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { confidence: 'desc' },
      take: limit,
    });

    res.json({ query: q, results: records, count: records.length });
  } catch {
    res.status(500).json({ error: 'Query failed' });
  }
});
