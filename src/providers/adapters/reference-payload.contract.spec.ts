import { describe, expect, it } from 'vitest';
import { MetaAdapter } from './meta.adapter';
import { EvolutionAdapter } from './evolution.adapter';
import { ZApiAdapter } from './zapi.adapter';
import { loadReferenceFixture } from '../../test-support/load-reference-fixture';

describe('Webhooks — payloads de referência (prova, seção 5)', () => {
  const expectedText = 'Olá, gostaria de saber mais sobre o produto';
  const expectedFrom = '5511988888888';
  const expectedMessageId = '3EB0B430B6F8C1D073A0';

  it('Meta Cloud API: JSON de referência normaliza corretamente', () => {
    const payload = loadReferenceFixture('meta-cloud-reference.json');
    const result = new MetaAdapter().parse(payload);

    expect(result).toMatchObject({
      id: 'wamid.HBgNNTUxMTk5OTk5OTk5ORUCABIYFjNFQjBCNkU3',
      provider: 'meta',
      from: expectedFrom,
      content: expectedText
    });
    expect(result.timestamp).toEqual(new Date(1677234567 * 1000));
  });

  it('Evolution API: JSON de referência normaliza corretamente', () => {
    const payload = loadReferenceFixture('evolution-reference.json');
    const result = new EvolutionAdapter().parse(payload);

    expect(result).toMatchObject({
      id: expectedMessageId,
      provider: 'evolution',
      from: expectedFrom,
      content: expectedText
    });
    expect(result.timestamp).toEqual(new Date(1677234567 * 1000));
  });

  it('Z-API: JSON de referência normaliza corretamente', () => {
    const payload = loadReferenceFixture('zapi-reference.json');
    const result = new ZApiAdapter().parse(payload);

    expect(result).toMatchObject({
      id: expectedMessageId,
      provider: 'zapi',
      from: expectedFrom,
      content: expectedText
    });
    expect(result.timestamp).toEqual(new Date(1677234567000));
  });
});
