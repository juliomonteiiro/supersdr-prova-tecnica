import { z } from 'zod';
import { NormalizedMessage } from '../../domain/normalized-message';
import { PayloadValidationError } from '../../shared/errors';
import { WebhookAdapter } from '../webhook-adapter';

const zApiWebhookSchema = z.object({
  messageId: z.string().min(1),
  phone: z.string().min(1),
  momment: z.number().optional(),
  text: z
    .object({
      message: z.string().min(1)
    })
    .optional()
});

export class ZApiAdapter implements WebhookAdapter {
  parse(payload: unknown): NormalizedMessage {
    const parsed = zApiWebhookSchema.safeParse(payload);

    if (!parsed.success) {
      throw new PayloadValidationError(
        'zapi',
        parsed.error.issues.map((issue) => issue.message).join(', ')
      );
    }

    const data = parsed.data;

    return {
      id: data.messageId,
      provider: 'zapi',
      from: data.phone,
      content: data.text?.message ?? '',
      timestamp: data.momment ? new Date(data.momment) : new Date()
    };
  }
}