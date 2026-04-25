import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const FIXTURE_DIR = join(process.cwd(), 'test', 'fixtures');

export type ReferenceFixtureName =
	| 'meta-cloud-reference.json'
	| 'evolution-reference.json'
	| 'zapi-reference.json';

export function loadReferenceFixture(name: ReferenceFixtureName): unknown {
	const filePath = join(FIXTURE_DIR, name);
	return JSON.parse(readFileSync(filePath, 'utf8')) as unknown;
}
