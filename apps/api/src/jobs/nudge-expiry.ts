import 'dotenv/config';
import { logger } from './lib/logger.js';

// Placeholder for Bull cron jobs (nudge expiry etc)
logger.info('Cron scheduler started');

// Expiry check every hour via simple setInterval
setInterval(async () => {
  const { prisma } = await import('./lib/prisma.js');
  const expired = await prisma.pendingNudge.updateMany({
    where: { status: 'sent', expiresAt: { lt: new Date() } },
    data: { status: 'expired' },
  });
  if (expired.count > 0) logger.info({ count: expired.count }, 'Expired nudges cleaned up');
}, 60 * 60 * 1000);
