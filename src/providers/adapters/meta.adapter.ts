import { z } from 'zod';
import { NormalizedMessage } from '../../domain/normalized-message';
import { PayloadValidationError } from '../../shared/errors';
import { WebhookAdapter } from '../webhook-adapter';

const metaWebhookSchema = z.object({
  entry: z.array(
    z.object({
      changes: z.array(
        z.object({
          value: z.object({
            messages: z.array(
              z.object({
                id: z.string().min(1),
                from: z.string().min(1),
                timestamp: z.string().min(1),
                text: z
                  .object({
                    body: z.string().optional()
                  })
                  .optional()
              })
            )
          })
        })
      )
    })
  )
});

export class MetaAdapter implements WebhookAdapter {
  parse(payload: unknown): NormalizedMessage {
    const parsed = metaWebhookSchema.safeParse(payload);

    if (!parsed.success) {
      throw new PayloadValidationError(
        'meta',
        parsed.error.issues.map((issue) => issue.message).join(', ')
      );
    }

    const message = parsed.data.entry[0].changes[0].value.messages[0];
    const secondsTimestamp = Number(message.timestamp);

    return {
      id: message.id,
      provider: 'meta',
      from: message.from,
      content: message.text?.body ?? '',
      timestamp: Number.isNaN(secondsTimestamp)
        ? new Date()
        : new Date(secondsTimestamp * 1000)
    };
  }
}
