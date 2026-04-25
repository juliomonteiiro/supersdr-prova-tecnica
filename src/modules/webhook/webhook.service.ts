import { AdapterFactory } from '../../providers/adapter.factory';
import { ProcessMessageUseCase } from '../../application/process-message.usecase';
import { logger } from '../../infra/logger/logger';

export class WebhookService {
  private useCase = new ProcessMessageUseCase();

  async handle(provider: string, payload: any) {

    logger.info({ provider }, 'Webhook received');

    const adapter = AdapterFactory.getAdapter(provider);

    const normalized = adapter.parse(payload);

    logger.info(
      {
        provider,
        messageId: normalized.id,
        from: normalized.from
      },
      'Message normalized'
    );

    await this.useCase.execute(normalized);

    logger.info(
      { messageId: normalized.id },
      'Message processed'
    );

    return normalized;
  }
}