import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { logger } from '@shared/logger';

const rpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org';

let publicClient: ReturnType<typeof createPublicClient> | null = null;

export function getViemClient() {
  if (!publicClient) {
    publicClient = createPublicClient({
      chain: base,
      transport: http(rpcUrl),
    }) as ReturnType<typeof createPublicClient>;

    logger.info('Viem client initialized for Base network', { rpcUrl });
  }

  return publicClient;
}

export async function verifyChainConnection(): Promise<boolean> {
  try {
    const blockNumber = await getViemClient().getBlockNumber();
    logger.info('Chain connection verified', { blockNumber: blockNumber.toString() });
    return true;
  } catch (error) {
    logger.error('Failed to verify chain connection', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
