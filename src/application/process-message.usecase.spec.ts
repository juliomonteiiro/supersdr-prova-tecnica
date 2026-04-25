import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProcessMessageUseCase } from './process-message.usecase';

const mocks = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
  createMock: vi.fn(),
  warnMock: vi.fn(),
  infoMock: vi.fn()
}));

vi.mock('../infra/db/prisma.service', () => ({
  prisma: {
    message: {
      findUnique: mocks.findUniqueMock,
      create: mocks.createMock
    }
  }
}));

vi.mock('../infra/logger/logger', () => ({
  logger: {
    warn: mocks.warnMock,
    info: mocks.infoMock
  }
}));

describe('ProcessMessageUseCase', () => {
  const useCase = new ProcessMessageUseCase();
  const message = {
    id: 'msg-1',
    provider: 'zapi' as const,
    from: '5511999999999',
    content: 'hello',
    timestamp: new Date('2024-01-01T00:00:00.000Z')
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves message when it does not exist', async () => {
    mocks.findUniqueMock.mockResolvedValue(null);
    mocks.createMock.mockResolvedValue({});

    await useCase.execute(message);

    expect(mocks.findUniqueMock).toHaveBeenCalledWith({
      where: { externalId: message.id }
    });
    expect(mocks.createMock).toHaveBeenCalledWith({
      data: {
        externalId: message.id,
        provider: message.provider,
        from: message.from,
        content: message.content,
        createdAt: message.timestamp
      }
    });
    expect(mocks.infoMock).toHaveBeenCalled();
  });

  it('does not save duplicate message', async () => {
    mocks.findUniqueMock.mockResolvedValue({ id: 'db-id' });

    await useCase.execute(message);

    expect(mocks.createMock).not.toHaveBeenCalled();
    expect(mocks.warnMock).toHaveBeenCalled();
  });
});
