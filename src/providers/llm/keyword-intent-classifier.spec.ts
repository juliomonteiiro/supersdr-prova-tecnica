import { describe, expect, it } from 'vitest';
import { KeywordIntentClassifier } from './keyword-intent-classifier';

describe('KeywordIntentClassifier', () => {
  const classifier = new KeywordIntentClassifier();

  it('classifies lead messages', async () => {
    const result = await classifier.classify('Olá, tenho interesse em contratar');
    expect(result.intent).toBe('lead');
    expect(result.provider).toBe('keyword');
  });

  it('classifies support messages', async () => {
    const result = await classifier.classify('Estou com problema, nao funciona');
    expect(result.intent).toBe('support');
  });
});
