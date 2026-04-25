import { EvolutionAdapter } from '../providers/adapters/evolution.adapter';
import { MetaAdapter } from '../providers/adapters/meta.adapter';
import { AdapterFactory } from '../providers/adapter.factory';
import { AppError } from '../shared/errors';
import { loadReferenceFixture } from '../test-support/load-reference-fixture';

function captureAppError(run: () => void): { error: string; code: string } {
  try {
    run();
  } catch (e) {
    if (e instanceof AppError) {
      return { error: e.message, code: e.code };
    }
    throw e;
  }
  throw new Error('expected AppError');
}

/**
 * Mesmo JSON que a API devolve em 200 após parse bem-sucedido:
 * EvolutionAdapter + fixture evolution-reference (serialização de Date como no Express).
 */
export function buildSuccess200Example(): Record<string, unknown> {
  const payload = loadReferenceFixture('evolution-reference.json');
  const n = new EvolutionAdapter().parse(payload);
  return {
    id: n.id,
    provider: n.provider,
    from: n.from,
    content: n.content,
    timestamp: n.timestamp.toISOString()
  };
}

export const realErrorExamples = {
  invalidPayload: captureAppError(() => {
    new MetaAdapter().parse({});
  }),
  unknownProvider: captureAppError(() => {
    AdapterFactory.getAdapter('telegram');
  }),
  zapiUnauthorized: {
    error: 'Invalid or missing token for Z-API webhook',
    code: 'ZAPI_WEBHOOK_UNAUTHORIZED'
  } as const,
  internal: {
    error: 'Internal processing error',
    code: 'INTERNAL_ERROR'
  } as const
};
