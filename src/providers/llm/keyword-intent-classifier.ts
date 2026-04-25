import {
	IntentClassifier,
	IntentClassificationResult,
	IntentLabel
} from './intent-classifier';

function classifyByKeywords(text: string): { intent: IntentLabel; reason: string } {
	const normalized = text.toLowerCase();

	if (/(comprar|contratar|interesse|quero|produto)/.test(normalized)) {
		return { intent: 'lead', reason: 'Detected commercial intent keywords.' };
	}
	if (/(preco|valor|orcamento|budget|custa)/.test(normalized)) {
		return { intent: 'pricing', reason: 'Detected pricing-related keywords.' };
	}
	if (/(erro|problema|suporte|ajuda|nao funciona)/.test(normalized)) {
		return { intent: 'support', reason: 'Detected support-related keywords.' };
	}
	if (/(casino|aposta|adult|bitcoin|ganhe dinheiro|promo imperdivel)/.test(normalized)) {
		return { intent: 'spam', reason: 'Detected likely spam keywords.' };
	}
	return { intent: 'other', reason: 'No specific intent keywords detected.' };
}

export class KeywordIntentClassifier implements IntentClassifier {
	async classify(messageContent: string): Promise<IntentClassificationResult> {
		const { intent, reason } = classifyByKeywords(messageContent);
		return {
			intent,
			confidence: 0.65,
			provider: 'keyword',
			model: 'keyword-v1',
			reason
		};
	}
}
