import 'dotenv/config';
import { logger } from './lib/logger.js';

logger.info('Black Box Cron starting');
import('./jobs/nudge-expiry.js');
