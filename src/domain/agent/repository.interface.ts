import { Agent } from './types';

export interface IAgentRepository {
  save(agent: Agent): Promise<void>;
  findById(id: string): Promise<Agent | null>;
  findByOwnerId(ownerId: string): Promise<Agent[]>;
  findAll(): Promise<Agent[]>;
  delete(id: string): Promise<void>;
}
