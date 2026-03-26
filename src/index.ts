// Main export point for velkaris-core library

export * from './domain';
export * from './application';
export * from './infrastructure';
export * from './interfaces';
export * from './shared';

import { logger } from '@shared/logger';

export async function initializeCore(): Promise<void> {
  logger.info('Initializing velkaris-core');

  // TODO: Wire up repositories, use cases, and services
  // TODO: Initialize database connection
  // TODO: Setup event handlers
  // TODO: Register scheduled jobs
  // TODO: Initialize blockchain client

  logger.info('velkaris-core initialized successfully');
}

export async function shutdownCore(): Promise<void> {
  logger.info('Shutting down velkaris-core');

  // TODO: Cleanup database connections
  // TODO: Stop scheduled jobs
  // TODO: Flush event bus

  logger.info('velkaris-core shut down successfully');
}
