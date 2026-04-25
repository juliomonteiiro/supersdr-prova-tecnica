import { describe, expect, it } from 'vitest';
import { MetaAdapter } from './meta.adapter';
import { PayloadValidationError } from '../../shared/errors';

describe('MetaAdapter', () => {
  const adapter = new MetaAdapter();

  it('parses a valid payload into normalized message', () => {
    const result = adapter.parse({
      entry: [
        {
          changes: [
            {
              value: {
                messages: [
                  {
                    id: 'wamid.123',
                    from: '5511988888888',
                    timestamp: '1677234567',
                    text: { body: 'Hello from Meta' }
                  }
                ]
              }
            }
          ]
        }
      ]
    });

    expect(result).toMatchObject({
      id: 'wamid.123',
      provider: 'meta',
      from: '5511988888888',
      content: 'Hello from Meta'
    });
    expect(result.timestamp).toBeInstanceOf(Date);
  });

  it('throws validation error for invalid payload', () => {
    expect(() => adapter.parse({ object: 'whatsapp_business_account' })).toThrow(
      PayloadValidationError
    );
  });
});
