import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { logger } from '@shared/logger';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(databaseUrl);
export const db = drizzle(client);

export async function connectDatabase() {
  try {
    // Test connection
    await client`SELECT 1`;
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export async function disconnectDatabase() {
  try {
    await client.end();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error('Failed to disconnect from database', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
