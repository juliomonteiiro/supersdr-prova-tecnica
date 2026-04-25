import { describe, expect, it } from 'vitest';
import { AdapterFactory } from './adapter.factory';
import { ProviderNotSupportedError } from '../shared/errors';

describe('AdapterFactory', () => {
  it.each(['zapi', 'ZAPI', '  zapi  ', 'meta', 'META', 'evolution', 'Evolution'])(
    'resolve o provedor "%s" (case-insensitive)',
    (param) => {
      const adapter = AdapterFactory.getAdapter(param);
      expect(adapter).toBeDefined();
      expect(typeof adapter.parse).toBe('function');
    }
  );

  it('rejeita provedor desconhecido', () => {
    expect(() => AdapterFactory.getAdapter('telegram')).toThrow(
      ProviderNotSupportedError
    );
  });
});
