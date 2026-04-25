import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SuperSDR Webhook API',
      version: '1.0.0',
      description: 'Sistema de normalização de webhooks'
    }
  },
  apis: ['./src/modules/**/*.ts']
});