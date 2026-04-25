import { z } from 'zod';
import { env } from '../../config/env';
import {
	IntentClassifier,
	IntentClassificationResult,
	INTENT_LABELS
} from './intent-classifier';

const llmOutputSchema = z.object({
	intent: z.enum(INTENT_LABELS),
	confidence: z.number().min(0).max(1),
	reason: z.string().optional()
});

export class OpenAIIntentClassifier implements IntentClassifier {
	constructor(
		private readonly apiKey: string,
		private readonly model: string = env.OPENAI_MODEL
	) { }

	async classify(messageContent: string): Promise<IntentClassificationResult> {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.apiKey}`
			},
			body: JSON.stringify({
				model: this.model,
				temperature: 0,
				response_format: { type: 'json_object' },
				messages: [
					{
						role: 'system',
						content:
							'Classify WhatsApp messages into one intent: lead, support, pricing, spam, other. Respond ONLY valid JSON: {"intent":"...","confidence":0..1,"reason":"..."}'
					},
					{
						role: 'user',
						content: messageContent
					}
				]
			})
		});

		if (!response.ok) {
			throw new Error(`OpenAI request failed with status ${response.status}`);
		}

		const data = (await response.json()) as {
			choices?: Array<{ message?: { content?: string } }>;
		};
		const rawContent = data.choices?.[0]?.message?.content;

		if (!rawContent) {
			throw new Error('OpenAI response did not include message content');
		}

		const parsedJson = JSON.parse(rawContent) as unknown;
		const parsed = llmOutputSchema.parse(parsedJson);

		return {
			intent: parsed.intent,
			confidence: parsed.confidence,
			provider: 'openai',
			model: this.model,
			reason: parsed.reason,
			raw: parsedJson
		};
	}
}
