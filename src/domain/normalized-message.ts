export type SupportedProvider = 'zapi' | 'meta';

export interface NormalizedMessage {
  id: string;
  provider: SupportedProvider;
  from: string;
  content: string;
  timestamp: Date;
}
