export const INTENT_LABELS = [
	'lead',
	'support',
	'pricing',
	'spam',
	'other'
] as const;

export type IntentLabel = (typeof INTENT_LABELS)[number];

export type IntentClassificationResult = {
	intent: IntentLabel;
	confidence: number;
	provider: 'openai' | 'keyword';
	model: string;
	reason?: string;
	raw?: unknown;
};

export interface IntentClassifier {
	classify(messageContent: string): Promise<IntentClassificationResult>;
}
