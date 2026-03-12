import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { logger } from './lib/logger.js';
import { prisma } from './lib/prisma.js';

// Route handlers
import { decisionsRouter } from './api/decisions.js';
import { queryRouter } from './api/query.js';
import { analyticsRouter } from './api/analytics.js';
import { usersRouter } from './api/users.js';
import { settingsRouter } from './api/settings.js';
import { reviewRouter } from './api/review.js';
import { githubWebhookRouter } from './api/webhooks/github.js';
import { slackWebhookRouter } from './api/webhooks/slack.js';
import { mcpRouter } from './api/mcp.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Core middleware
app.use(helmet());
app.use(cors({ origin: process.env.DASHBOARD_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    service: 'blackbox-api',
  });
});

// API routes
app.use('/api/decisions', decisionsRouter);
app.use('/api/query', queryRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/users', usersRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/review', reviewRouter);
app.use('/webhooks/github', githubWebhookRouter);
app.use('/webhooks/slack', slackWebhookRouter);
app.use('/api/v1/mcp', mcpRouter);

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err, path: req.path }, 'Unhandled error');
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Black Box API running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
