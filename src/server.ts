import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { WebhookController } from './modules/webhook/webhook.controller';
import { logger } from './infra/logger/logger';
import { disconnectDatabase } from './infra/db/prisma.service';

const app = express();
app.use(express.json());

const controller = new WebhookController();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.post('/webhook/:provider', (req, res) => {
  controller.receive(req, res);
});

const server = app.listen(3000, () => {
  logger.info('Server running on http://localhost:3000');
  logger.info('Swagger docs on http://localhost:3000/docs');
});

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutdown signal received');

  server.close(async () => {
    try {
      await disconnectDatabase();
      logger.info('HTTP server and database connections closed');
      process.exit(0);
    } catch (error) {
      logger.error({ err: error }, 'Failed to close resources gracefully');
      process.exit(1);
    }
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));