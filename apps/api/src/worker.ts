import 'dotenv/config';
import express from 'express';
import { processPrJob } from './jobs/process-pr.js';
import { logger } from './lib/logger.js';

const app = express();
app.use(express.json());

// Worker health
app.get('/health', (_req, res) => res.json({ status: 'worker-ok' }));

app.listen(3002, () => {
  logger.info('Black Box Worker running on port 3002');
});

export default app;
