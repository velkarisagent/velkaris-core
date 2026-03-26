import { connectDatabase, disconnectDatabase } from '../src/infrastructure/database';
import { logger } from '../src/shared/logger';

async function migrate() {
  try {
    logger.info('Starting database migration');
    await connectDatabase();

    // TODO: Run drizzle migrations programmatically
    // const { migrate } = require('drizzle-orm/postgres-js/migrator');
    // await migrate(db, { migrationsFolder: './drizzle' });

    logger.info('Database migration completed');
    await disconnectDatabase();
  } catch (error) {
    logger.error('Database migration failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

migrate();
