import { buildWebhookRequestExamples } from './webhook-request-examples';
import { buildSuccess200Example, realErrorExamples } from './response-examples';

const requestExamples = buildWebhookRequestExamples();
const success200Example = buildSuccess200Example();

const jsonBody: Record<string, unknown> = {
  required: true,
  description: 'JSON bruto. Troque o exemplo no menu abaixo.',
  content: {
    'application/json': {
      schema: { type: 'object' },
      ...(requestExamples ? { examples: requestExamples } : {})
    }
  }
};

export const webhookPaths = {
  '/webhook/{provider}': {
    post: {
      tags: ['Webhooks'],
      operationId: 'receiveWebhook',
      summary: 'Webhook de provedor',
      description: 'Normaliza e grava. Provedores: zapi, meta, evolution.',
      parameters: [
        {
          name: 'provider',
          in: 'path',
          required: true,
          description: 'Nome do provedor na URL.',
          schema: { type: 'string', example: 'meta' }
        }
      ],
      requestBody: jsonBody,
      responses: {
        '200': {
          description: 'Corpo igual ao JSON de resposta da API.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NormalizedMessage' },
              example: success200Example
            }
          }
        },
        '400': {
          description: 'Payload inválido ou provedor não suportado.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                invalid: {
                  summary: 'Payload inválido',
                  value: realErrorExamples.invalidPayload
                },
                unknown: {
                  summary: 'Provedor desconhecido',
                  value: realErrorExamples.unknownProvider
                }
              }
            }
          }
        },
        '401': {
          description: 'Token Z-API inválido ou ausente.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: realErrorExamples.zapiUnauthorized
            }
          }
        },
        '500': {
          description: 'Erro interno.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: realErrorExamples.internal
            }
          }
        }
      }
    }
  }
};
