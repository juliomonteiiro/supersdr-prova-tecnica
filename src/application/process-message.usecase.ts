import { prisma } from '../infra/db/prisma.service';
import { logger } from '../infra/logger/logger';

export class ProcessMessageUseCase {
  async execute(message: any) {

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

    await prisma.message.create({
      data: {
        externalId: message.id,
        provider: message.provider,
        from: message.from,
        content: message.content
      }
    });

    logger.info(
      { messageId: message.id },
      'Message saved to database'
    );
  }
}