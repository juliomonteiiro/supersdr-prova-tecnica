import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IntentClassificationService } from './intent-classification.service';

const mocks = vi.hoisted(() => ({
  upsertMock: vi.fn(),
  infoMock: vi.fn(),
  errorMock: vi.fn()
}));

vi.mock('../../infra/db/prisma.service', () => ({
  prisma: {
    messageIntent: {
      upsert: mocks.upsertMock
    }
  }
}));

vi.mock('../../infra/logger/logger', () => ({
  logger: {
    info: mocks.infoMock,
    error: mocks.errorMock
  }
}));

describe('IntentClassificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('persists classification result', async () => {
    const service = new IntentClassificationService({
      classify: vi.fn().mockResolvedValue({
        intent: 'lead',
        confidence: 0.93,
        provider: 'keyword',
        model: 'keyword-v1',
        reason: 'Detected commercial intent.'
      })
    });

    await service.classifyAndPersist('message-id-1', 'quero comprar');

    expect(mocks.upsertMock).toHaveBeenCalled();
    expect(mocks.infoMock).toHaveBeenCalled();
  });

  it('handles classifier errors without throwing', async () => {
    const service = new IntentClassificationService({
      classify: vi.fn().mockRejectedValue(new Error('LLM timeout'))
    });

    await expect(
      service.classifyAndPersist('message-id-2', 'texto qualquer')
    ).resolves.toBeUndefined();
    expect(mocks.errorMock).toHaveBeenCalled();
  });
});
