import { ProviderNotSupportedError } from '../shared/errors';
import { MetaAdapter } from './adapters/meta.adapter';
import { ZApiAdapter } from './adapters/zapi.adapter';
import { WebhookAdapter } from './webhook-adapter';

export class AdapterFactory {
  static getAdapter(provider: string): WebhookAdapter {
    switch (provider) {
      case 'zapi':
        return new ZApiAdapter();
      case 'meta':
        return new MetaAdapter();
      default:
        throw new ProviderNotSupportedError(provider);
    }
  }
}