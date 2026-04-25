import { describe, expect, it } from 'vitest';
import { swaggerSpec } from '../swagger';
import { buildSuccess200Example } from './response-examples';

describe('OpenAPI (Swagger)', () => {
  it('define POST /webhook/{provider} com respostas documentadas', () => {
    const post = swaggerSpec.paths?.['/webhook/{provider}']?.post;
    expect(post?.operationId).toBe('receiveWebhook');
    expect(post?.responses?.['200']).toBeDefined();
    expect(post?.responses?.['400']).toBeDefined();
    expect(post?.responses?.['401']).toBeDefined();
    expect(post?.responses?.['500']).toBeDefined();
    expect(swaggerSpec.components?.schemas?.NormalizedMessage).toBeDefined();
    expect(swaggerSpec.components?.schemas?.ErrorResponse).toBeDefined();
  });

  it('200 no spec é idêntico ao JSON que o sistema retorna (adapter + fixture)', () => {
    const ex =
      swaggerSpec.paths?.['/webhook/{provider}']?.post?.responses?.['200']?.content?.[
        'application/json'
      ]?.example as Record<string, unknown> | undefined;
    expect(ex).toEqual(buildSuccess200Example());
    expect(ex?.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/
    );
  });

  it('400 inclui exemplos com códigos reais do sistema', () => {
    const examples = swaggerSpec.paths?.['/webhook/{provider}']?.post?.responses?.['400']
      ?.content?.['application/json']?.examples as
      | Record<string, { value?: { code?: string } }>
      | undefined;
    expect(examples?.invalid?.value?.code).toBe('INVALID_PAYLOAD');
    expect(examples?.unknown?.value?.code).toBe('PROVIDER_NOT_SUPPORTED');
  });

  it('inclui exemplos de request quando test/fixtures existe', () => {
    const content =
      swaggerSpec.paths?.['/webhook/{provider}']?.post?.requestBody?.content?.[
        'application/json'
      ];
    expect(content?.examples).toBeDefined();
    expect(content?.examples?.meta).toBeDefined();
    expect(content?.examples?.evolution).toBeDefined();
    expect(content?.examples?.zapi).toBeDefined();
  });
});
