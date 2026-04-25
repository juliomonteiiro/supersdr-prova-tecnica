import { NormalizedMessage } from '../domain/normalized-message';

export interface WebhookAdapter {
  parse(payload: unknown): NormalizedMessage;
}
