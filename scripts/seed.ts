import { connectDatabase, disconnectDatabase } from '../src/infrastructure/database';
import { AgentRepository } from '../src/infrastructure/database/repositories';
import { SellerRepository } from '../src/infrastructure/database/repositories';
import { Agent } from '../src/domain/agent';
import { Seller } from '../src/domain/seller';
import { logger } from '../src/shared/logger';

async function seed() {
  try {
    logger.info('Starting database seeding');
    await connectDatabase();

    const agentRepo = new AgentRepository();
    const sellerRepo = new SellerRepository();

    // Seed agents
    const agent = Agent.create(
      'owner-1',
      'Sample AI Agent',
      'A sample AI agent for marketplace testing',
      ['language-processing', 'knowledge-retrieval'],
    );
    agent.verify();
    await agentRepo.save(agent);
    logger.info('Agent seeded', { agentId: agent.getId() });

    // Seed sellers
    const seller = Seller.create(
      '0x1234567890123456789012345678901234567890',
      'Sample Seller',
      'A sample seller on the marketplace',
    );
    seller.verify();
    await sellerRepo.save(seller);
    logger.info('Seller seeded', { sellerId: seller.getId() });

    logger.info('Database seeding completed');
    await disconnectDatabase();
  } catch (error) {
    logger.error('Database seeding failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

seed();
