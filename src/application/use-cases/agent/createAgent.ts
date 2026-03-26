import { Agent } from '@domain/agent';
import { IAgentRepository } from '@domain/agent';
import { ValidationError } from '@shared/errors';
import { logger } from '@shared/logger';

export interface CreateAgentInput {
  ownerId: string;
  name: string;
  description: string;
  capabilities: string[];
}

export interface CreateAgentOutput {
  agentId: string;
  ownerId: string;
  name: string;
}

export class CreateAgentUseCase {
  constructor(private agentRepository: IAgentRepository) {}

  async execute(input: CreateAgentInput): Promise<CreateAgentOutput> {
    if (!input.ownerId || !input.name || !input.description) {
      throw new ValidationError('Missing required fields', {
        fields: ['ownerId', 'name', 'description'],
      });
    }

    if (input.capabilities.length === 0) {
      throw new ValidationError('Agent must have at least one capability');
    }

    const agent = Agent.create(
      input.ownerId,
      input.name,
      input.description,
      input.capabilities,
    );

    await this.agentRepository.save(agent);

    logger.info('Agent created successfully', {
      agentId: agent.getId(),
      ownerId: input.ownerId,
    });

    return {
      agentId: agent.getId(),
      ownerId: agent.getOwnerId(),
      name: agent.getName(),
    };
  }
}
