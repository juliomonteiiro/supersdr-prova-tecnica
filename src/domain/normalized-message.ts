export type SupportedProvider = 'zapi' | 'meta' | 'evolution';

export interface NormalizedMessage {
  id: string;
  provider: SupportedProvider;
  from: string;
  content: string;
  timestamp: Date;
}
