import { z } from 'zod';
import { logger } from '@shared/logger';

const configSchema = z.object({
  nodeEnv: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  databaseUrl: z.string().url(),
  baseRpcUrl: z.string().url().default('https://mainnet.base.org'),
  baseChainId: z.number().default(8453),
  logLevel: z
    .enum(['error', 'warn', 'info', 'debug'])
    .default('info'),
  enableBlockchainVerification: z.boolean().default(true),
  enableTransactionCoordination: z.boolean().default(true),
  redisUrl: z.string().optional(),
  marketplaceContractAddress: z.string().default(
    '0x0000000000000000000000000000000000000000',
  ),
  paymentContractAddress: z.string().default(
    '0x0000000000000000000000000000000000000000',
  ),
});

export type AppConfig = z.infer<typeof configSchema>;

export function loadConfig(): AppConfig {
  const rawConfig = {
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL,
    baseRpcUrl: process.env.BASE_RPC_URL,
    baseChainId: process.env.BASE_CHAIN_ID
      ? parseInt(process.env.BASE_CHAIN_ID, 10)
      : 8453,
    logLevel: process.env.LOG_LEVEL,
    enableBlockchainVerification:
      process.env.ENABLE_BLOCKCHAIN_VERIFICATION === 'true',
    enableTransactionCoordination:
      process.env.ENABLE_TRANSACTION_COORDINATION === 'true',
    redisUrl: process.env.REDIS_URL,
    marketplaceContractAddress: process.env.MARKETPLACE_CONTRACT_ADDRESS,
    paymentContractAddress: process.env.PAYMENT_CONTRACT_ADDRESS,
  };

  try {
    const config = configSchema.parse(rawConfig);
    logger.info('Configuration loaded successfully', {
      nodeEnv: config.nodeEnv,
      baseChainId: config.baseChainId,
    });
    return config;
  } catch (error) {
    logger.error('Configuration validation failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

let cachedConfig: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }
  return cachedConfig;
}
