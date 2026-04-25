import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type ExampleEntry = { summary: string; value: unknown };

export function buildWebhookRequestExamples():
  | Record<string, ExampleEntry>
  | undefined {
  const dir = join(process.cwd(), 'test', 'fixtures');
  const files: Array<[string, string, string]> = [
    ['meta', 'Meta', 'meta-cloud-reference.json'],
    ['evolution', 'Evolution', 'evolution-reference.json'],
    ['zapi', 'Z-API', 'zapi-reference.json']
  ];

  const out: Record<string, ExampleEntry> = {};

  for (const [key, label, file] of files) {
    try {
      const raw = readFileSync(join(dir, file), 'utf8');
      out[key] = {
        summary: label,
        value: JSON.parse(raw) as unknown
      };
    } catch {
      return undefined;
    }
  }

  return out;
}
