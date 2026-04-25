import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
	PORT: z.coerce.number().int().positive().default(3000),
	DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
	LOG_LEVEL: z.string().default('info'),
	/** When set, POST /webhook/zapi must send the same value in the Client-Token header (Z-API account security token). */
	ZAPI_CLIENT_TOKEN: z
		.string()
		.optional()
		.transform((v) => (v === '' || v === undefined ? undefined : v))
});

export const env = envSchema.parse(process.env);
