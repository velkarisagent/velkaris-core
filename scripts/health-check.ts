import { connectDatabase, disconnectDatabase } from '../src/infrastructure/database';
import { getConfig } from '../src/infrastructure/external/config';
import { verifyChainConnection } from '../src/infrastructure/blockchain/viemClient';
import { logger } from '../src/shared/logger';

async function healthCheck() {
  try {
    logger.info('Starting health check');

    // Check configuration
    const config = getConfig();
    logger.info('Configuration loaded', { nodeEnv: config.nodeEnv });

    // Check database connection
    await connectDatabase();
    logger.info('Database connection verified');

    // Check blockchain connection
    if (config.enableBlockchainVerification) {
      const isConnected = await verifyChainConnection();
      if (!isConnected) {
        logger.warn('Blockchain connection failed');
      }
    }

    await disconnectDatabase();
    logger.info('Health check passed');
  } catch (error) {
    logger.error('Health check failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

healthCheck();
