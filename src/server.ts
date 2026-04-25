import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { WebhookController } from './modules/webhook/webhook.controller';
import { logger } from './infra/logger/logger';

const app = express();
app.use(express.json());

const controller = new WebhookController();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.post('/webhook/:provider', (req, res) => {
  controller.receive(req, res);
});

app.listen(3000, () => {
  logger.info('Server running on http://localhost:3000');
  logger.info('Swagger docs on http://localhost:3000/docs');
});