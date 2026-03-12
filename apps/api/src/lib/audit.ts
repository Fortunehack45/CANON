import { ulid } from 'ulid';
import { prisma } from './prisma.js';

interface AuditParams {
  orgId: string;
  actorId?: string;
  action: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

export async function writeAuditLog(params: AuditParams): Promise<void> {
  await prisma.auditLog.create({
    data: {
      id: ulid(),
      orgId: params.orgId,
      actorId: params.actorId,
      action: params.action,
      targetId: params.targetId,
      metadata: params.metadata ?? {},
      ipAddress: params.ipAddress,
    },
  });
}
