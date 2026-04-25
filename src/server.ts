import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { WebhookController } from './modules/webhook/webhook.controller';

const app = express();
app.use(express.json());

const controller = new WebhookController();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.post('/webhook/:provider', (req, res) => {
  controller.receive(req, res);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Swagger on http://localhost:3000/docs');
});