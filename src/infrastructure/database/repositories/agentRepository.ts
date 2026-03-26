import { Agent } from '@domain/agent';
import { IAgentRepository } from '@domain/agent';
import { db } from '../connection';
import { agentsTable } from '../schema';
import { eq } from 'drizzle-orm';
import { logger } from '@shared/logger';

export class AgentRepository implements IAgentRepository {
  async save(agent: Agent): Promise<void> {
    const props = agent.toPersistence();
    const capabilities = JSON.stringify(props.capabilities);

    try {
      await db
        .insert(agentsTable)
        .values({
          id: props.id,
          ownerId: props.ownerId,
          name: props.name,
          description: props.description,
          version: props.version,
          capabilities,
          verified: props.verified,
          createdAt: props.createdAt,
          updatedAt: props.updatedAt,
        })
        .onConflictDoUpdate({
          target: agentsTable.id,
          set: {
            name: props.name,
            description: props.description,
            capabilities,
            verified: props.verified,
            updatedAt: props.updatedAt,
          },
        });

      logger.debug('Agent saved', { agentId: props.id });
    } catch (error) {
      logger.error('Failed to save agent', {
        agentId: props.id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findById(id: string): Promise<Agent | null> {
    try {
      const row = await db.select().from(agentsTable).where(eq(agentsTable.id, id));

      if (row.length === 0) return null;

      const result = row[0];
      return Agent.fromPersistence({
        id: result.id,
        ownerId: result.ownerId,
        name: result.name,
        description: result.description,
        version: result.version,
        capabilities: JSON.parse(result.capabilities),
        verified: result.verified,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      });
    } catch (error) {
      logger.error('Failed to find agent', {
        agentId: id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findByOwnerId(ownerId: string): Promise<Agent[]> {
    try {
      const rows = await db
        .select()
        .from(agentsTable)
        .where(eq(agentsTable.ownerId, ownerId));

      return rows.map(r =>
        Agent.fromPersistence({
          id: r.id,
          ownerId: r.ownerId,
          name: r.name,
          description: r.description,
          version: r.version,
          capabilities: JSON.parse(r.capabilities),
          verified: r.verified,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      );
    } catch (error) {
      logger.error('Failed to find agents by owner', {
        ownerId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findAll(): Promise<Agent[]> {
    try {
      const rows = await db.select().from(agentsTable);

      return rows.map(r =>
        Agent.fromPersistence({
          id: r.id,
          ownerId: r.ownerId,
          name: r.name,
          description: r.description,
          version: r.version,
          capabilities: JSON.parse(r.capabilities),
          verified: r.verified,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      );
    } catch (error) {
      logger.error('Failed to find all agents', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.delete(agentsTable).where(eq(agentsTable.id, id));
      logger.debug('Agent deleted', { agentId: id });
    } catch (error) {
      logger.error('Failed to delete agent', {
        agentId: id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
