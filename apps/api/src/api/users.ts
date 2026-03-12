import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/authenticate.js';

export const usersRouter = Router();
usersRouter.use(authenticate);

// GET /api/users
usersRouter.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { orgId: req.user!.orgId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: users });
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/me
usersRouter.get('/me', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: req.user!.userId, orgId: req.user!.orgId },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Update lastSeenAt
    await prisma.user.update({ where: { id: user.id }, data: { lastSeenAt: new Date() } });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PATCH /api/users/:id (admin only)
usersRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { orgId } = req.user!;
    const user = await prisma.user.findFirst({ where: { id: req.params.id, orgId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const updated = await prisma.user.update({ where: { id: req.params.id }, data: req.body });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id (soft delete)
usersRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { orgId } = req.user!;
    const user = await prisma.user.findFirst({ where: { id: req.params.id, orgId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    await prisma.user.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});
