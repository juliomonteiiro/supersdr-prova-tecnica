import swaggerJsdoc from 'swagger-jsdoc';
import { openApiComponents } from './openapi/components';
import { webhookPaths } from './openapi/webhook.openapi';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'SuperSDR Webhooks',
      version: '1.0.0',
      description: 'POST /webhook/{provider}. Normalização de webhooks WhatsApp.'
    },
    servers: [{ url: '/', description: 'Este host' }],
    tags: [{ name: 'Webhooks', description: 'Recebimento por provedor.' }],
    paths: webhookPaths,
    components: openApiComponents
  },
  apis: []
});
