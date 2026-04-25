import { AdapterFactory } from '../../providers/adapter.factory';

export class WebhookService {
  async handle(provider: string, payload: any) {
    const adapter = AdapterFactory.getAdapter(provider);

    const normalized = adapter.parse(payload);

    console.log('Normalized:', normalized);

    return normalized;
  }
}