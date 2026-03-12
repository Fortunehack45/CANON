import { Redis } from 'ioredis';
import { logger } from './logger.js';

export const redis = new Redis(process.env.UPSTASH_REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

redis.on('error', (err) => {
  logger.error({ err }, 'Redis connection error');
});
