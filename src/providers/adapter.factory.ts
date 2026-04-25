import { ProviderNotSupportedError } from '../shared/errors';
import { EvolutionAdapter } from './adapters/evolution.adapter';
import { MetaAdapter } from './adapters/meta.adapter';
import { ZApiAdapter } from './adapters/zapi.adapter';
import { WebhookAdapter } from './webhook-adapter';

export class AdapterFactory {
  static getAdapter(provider: string): WebhookAdapter {
    const key = provider.trim().toLowerCase();

    switch (key) {
      case 'zapi':
        return new ZApiAdapter();
      case 'meta':
        return new MetaAdapter();
      case 'evolution':
        return new EvolutionAdapter();
      default:
        throw new ProviderNotSupportedError(key);
    }
  }
}