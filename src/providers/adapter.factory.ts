import { ZApiAdapter } from './adapters/zapi.adapter';

export class AdapterFactory {
  static getAdapter(provider: string) {
    switch (provider) {
      case 'zapi':
        return new ZApiAdapter();
      default:
        throw new Error(`Provider ${provider} not supported`);
    }
  }
}