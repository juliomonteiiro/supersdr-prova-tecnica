import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SuperSDR Webhook API',
      version: '1.0.0',
      description: 'Webhook normalization system'
    }
  },
  apis: ['./src/modules/**/*.ts']
});