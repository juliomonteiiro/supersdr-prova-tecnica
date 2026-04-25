import { describe, expect, it } from 'vitest';
import { ZApiAdapter } from './zapi.adapter';
import { PayloadValidationError } from '../../shared/errors';

describe('ZApiAdapter', () => {
  const adapter = new ZApiAdapter();

  it('parses a valid payload into normalized message', () => {
    const result = adapter.parse({
      messageId: 'msg-1',
      phone: '5511999999999',
      momment: 1677234567000,
      text: { message: 'Hello from Z-API' }
    });

    expect(result).toMatchObject({
      id: 'msg-1',
      provider: 'zapi',
      from: '5511999999999',
      content: 'Hello from Z-API'
    });
    expect(result.timestamp).toBeInstanceOf(Date);
  });

  it('throws validation error for invalid payload', () => {
    expect(() => adapter.parse({ phone: '5511999999999' })).toThrow(
      PayloadValidationError
    );
  });
});
