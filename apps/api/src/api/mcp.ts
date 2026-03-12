import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateMCPKey } from '../middleware/authenticate.js';

export const mcpRouter = Router();
mcpRouter.use(authenticateMCPKey);

// POST /api/v1/mcp/search
mcpRouter.post('/search', async (req: Request, res: Response) => {
  const { query, limit = 5 } = req.body;
  if (!query) return res.status(400).json({ error: 'query is required' });

  const orgId = req.user!.orgId;

  try {
    const records = await prisma.decisionRecord.findMany({
      where: {
        orgId,
        status: { in: ['auto_approved', 'confirmed'] },
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { why: { contains: query, mode: 'insensitive' } },
          { what: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { confidence: 'desc' },
      take: limit,
    });

    res.json({
      success: true,
      data: {
        answer: null, // Placeholder for RAG synthesis
        confidence: 'high',
        citations: records
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /api/v1/mcp/file
mcpRouter.get('/file', async (req: Request, res: Response) => {
  const { path: filePath } = req.query;
  if (!filePath) return res.status(400).json({ error: 'path is required' });

  try {
    const records = await prisma.decisionRecord.findMany({
      where: {
        orgId: req.user!.orgId,
        status: { in: ['auto_approved', 'confirmed'] },
        filesAffected: { has: String(filePath) }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ error: 'File retrieval failed' });
  }
});

// POST /api/v1/mcp/conflicts
mcpRouter.post('/conflicts', async (req: Request, res: Response) => {
  const { proposal } = req.body;
  if (!proposal) return res.status(400).json({ error: 'proposal is required' });

  try {
    // Simple conflict detection based on semantic similarity (using tags or keywords for now)
    const candidates = await prisma.decisionRecord.findMany({
      where: {
        orgId: req.user!.orgId,
        status: { in: ['auto_approved', 'confirmed'] },
        OR: [
          { title: { contains: proposal, mode: 'insensitive' } },
          { why: { contains: proposal, mode: 'insensitive' } },
        ]
      },
      take: 5
    });

    res.json({
      success: true,
      data: { 
        hasConflicts: candidates.length > 0, 
        conflicts: candidates.map((c: any) => ({
          record: c,
          reason: 'Potential contradiction found in architectural reasoning.'
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Conflict check failed' });
  }
});

// GET /api/v1/mcp/recent
mcpRouter.get('/recent', async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit ?? 10), 20);

  try {
    const records = await prisma.decisionRecord.findMany({
      where: {
        orgId: req.user!.orgId,
        status: { in: ['auto_approved', 'confirmed'] }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ error: 'Recent retrieval failed' });
  }
});
