import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { prisma } from '../lib/prisma';
import crypto from 'crypto';

export interface AuthenticatedUser {
  userId: string;
  orgId: string;
  role: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as AuthenticatedUser;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export async function authenticateMCPKey(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid API key' });
    return;
  }

  const apiKey = authHeader.slice(7);
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

  try {
    const keyRecord = await prisma.apiKey.findFirst({
      where: {
        keyHash,
        deletedAt: null,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        user: true
      }
    });

    if (!keyRecord) {
      res.status(401).json({ error: 'Invalid or expired API key' });
      return;
    }

    req.user = {
      userId: keyRecord.userId,
      orgId: keyRecord.orgId,
      role: keyRecord.user.role
    };

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsedAt: new Date() }
    });

    next();
  } catch (error) {
    console.error('authenticateMCPKey error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
}
