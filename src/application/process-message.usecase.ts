import { NormalizedMessage } from '../domain/normalized-message';
import { prisma } from '../infra/db/prisma.service';
import { logger } from '../infra/logger/logger';
import { intentClassificationService } from './llm/intent-classification.service';

export class ProcessMessageUseCase {
  async execute(message: NormalizedMessage): Promise<void> {

    const exists = await prisma.message.findUnique({
      where: { externalId: message.id }
    });

    if (exists) {
      logger.warn(
        { messageId: message.id },
        'Duplicate message ignored'
      );
      return;
    }

    const created = await prisma.message.create({
      data: {
        externalId: message.id,
        provider: message.provider,
        from: message.from,
        content: message.content,
        createdAt: message.timestamp
      }
    });

    intentClassificationService.enqueue(created.id, message.content);

    logger.info(
      { messageId: message.id },
      'Message saved to database'
    );
  }
}