import { z } from 'zod';
import { NormalizedMessage } from '../../domain/normalized-message';
import { PayloadValidationError } from '../../shared/errors';
import { WebhookAdapter } from '../webhook-adapter';

const evolutionWebhookSchema = z.object({
	event: z.string().optional(),
	data: z.object({
		key: z.object({
			remoteJid: z.string().min(1),
			id: z.string().min(1),
			fromMe: z.boolean().optional()
		}),
		message: z
			.object({
				conversation: z.string().optional()
			})
			.passthrough(),
		messageTimestamp: z.number()
	})
});

function phoneFromRemoteJid(remoteJid: string): string {
	const [user] = remoteJid.split('@');
	return user ?? remoteJid;
}

export class EvolutionAdapter implements WebhookAdapter {
	parse(payload: unknown): NormalizedMessage {
		const parsed = evolutionWebhookSchema.safeParse(payload);

		if (!parsed.success) {
			throw new PayloadValidationError(
				'evolution',
				parsed.error.issues.map((issue) => issue.message).join(', ')
			);
		}

		const { data } = parsed.data;
		const seconds = data.messageTimestamp;

		return {
			id: data.key.id,
			provider: 'evolution',
			from: phoneFromRemoteJid(data.key.remoteJid),
			content: data.message.conversation ?? '',
			timestamp: new Date(seconds * 1000)
		};
	}
}
