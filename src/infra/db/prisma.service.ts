import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    `DATABASE_URL is not set. Check your environment configuration for NODE_ENV=${process.env.NODE_ENV ?? 'undefined'}.`
  );
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

export async function disconnectDatabase() {
  await prisma.$disconnect();
  await pool.end();
}