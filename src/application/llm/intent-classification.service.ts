import { prisma } from '../../infra/db/prisma.service';
import { logger } from '../../infra/logger/logger';
import { createIntentClassifier } from '../../providers/llm/create-intent-classifier';
import { IntentClassifier } from '../../providers/llm/intent-classifier';

export class IntentClassificationService {
	constructor(private readonly classifier: IntentClassifier = createIntentClassifier()) { }

	enqueue(messageId: string, messageContent: string): void {
		setImmediate(() => {
			void this.classifyAndPersist(messageId, messageContent);
		});
	}

	async classifyAndPersist(messageId: string, messageContent: string): Promise<void> {
		try {
			if (!messageContent.trim()) {
				await prisma.messageIntent.upsert({
					where: { messageId },
					update: {
						intent: 'other',
						confidence: 0,
						provider: 'keyword',
						model: 'keyword-v1',
						reason: 'Empty message content.'
					},
					create: {
						messageId,
						intent: 'other',
						confidence: 0,
						provider: 'keyword',
						model: 'keyword-v1',
						reason: 'Empty message content.'
					}
				});
				return;
			}

			const result = await this.classifier.classify(messageContent);

			await prisma.messageIntent.upsert({
				where: { messageId },
				update: {
					intent: result.intent,
					confidence: result.confidence,
					provider: result.provider,
					model: result.model,
					reason: result.reason,
					raw: result.raw ?? undefined
				},
				create: {
					messageId,
					intent: result.intent,
					confidence: result.confidence,
					provider: result.provider,
					model: result.model,
					reason: result.reason,
					raw: result.raw ?? undefined
				}
			});

			logger.info(
				{
					messageId,
					intent: result.intent,
					provider: result.provider,
					model: result.model
				},
				'Message intent classified'
			);
		} catch (error) {
			logger.error({ err: error, messageId }, 'Intent classification failed');
		}
	}
}

export const intentClassificationService = new IntentClassificationService();
