import { describe, expect, it } from 'vitest';
import { EvolutionAdapter } from './evolution.adapter';
import { PayloadValidationError } from '../../shared/errors';

describe('EvolutionAdapter', () => {
  const adapter = new EvolutionAdapter();

  it('parses messages.upsert style payload', () => {
    const result = adapter.parse({
      event: 'messages.upsert',
      instance: 'minha-instancia',
      data: {
        key: {
          remoteJid: '5511988888888@s.whatsapp.net',
          fromMe: false,
          id: '3EB0B430B6F8C1D073A0'
        },
        pushName: 'João Silva',
        message: {
          conversation: 'Olá, gostaria de saber mais sobre o produto'
        },
        messageType: 'conversation',
        messageTimestamp: 1677234567
      }
    });

    expect(result).toMatchObject({
      id: '3EB0B430B6F8C1D073A0',
      provider: 'evolution',
      from: '5511988888888',
      content: 'Olá, gostaria de saber mais sobre o produto'
    });
    expect(result.timestamp).toEqual(new Date(1677234567 * 1000));
  });

  it('throws validation error for invalid payload', () => {
    expect(() => adapter.parse({ event: 'messages.upsert' })).toThrow(
      PayloadValidationError
    );
  });
});
