import { env } from '../../config/env';
import { IntentClassifier } from './intent-classifier';
import { KeywordIntentClassifier } from './keyword-intent-classifier';
import { OpenAIIntentClassifier } from './openai-intent-classifier';

export function createIntentClassifier(): IntentClassifier {
	if (env.OPENAI_API_KEY) {
		return new OpenAIIntentClassifier(env.OPENAI_API_KEY, env.OPENAI_MODEL);
	}
	return new KeywordIntentClassifier();
}
