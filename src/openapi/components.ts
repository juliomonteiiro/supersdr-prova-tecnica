export const openApiComponents = {
  schemas: {
    NormalizedMessage: {
      type: 'object',
      required: ['id', 'provider', 'from', 'content', 'timestamp'],
      properties: {
        id: { type: 'string' },
        provider: { type: 'string', enum: ['zapi', 'meta', 'evolution'] },
        from: { type: 'string' },
        content: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' }
      }
    },
    ErrorResponse: {
      type: 'object',
      required: ['error', 'code'],
      properties: {
        error: { type: 'string' },
        code: { type: 'string' }
      }
    }
  }
};
