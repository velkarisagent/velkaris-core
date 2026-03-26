import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/infrastructure/database/schema',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
} satisfies Config;
